import { Tournament } from '../models/Tournament.js';
import { AuctionSession } from '../models/AuctionSession.js';
import { Player } from '../models/Player.js';
import { Team } from '../models/Team.js';
import { AuditLog } from '../models/AuditLog.js';

export async function getActiveTournament(req, res) {
  try {
    const { orgId } = req.query;

    let query = {};
    if (orgId) {
      query.organisationId = orgId;
    }

    let tournament = await Tournament.findOne(query);
    if (!tournament) {
      tournament = await Tournament.findOne();
    }

    if (!tournament) {
      return res.status(404).json({ success: false, message: 'No tournament found' });
    }

    const session = await AuctionSession.findOne({ tournamentId: tournament._id });
    const teamCount = await Team.countDocuments({ tournamentId: tournament._id });
    const playerCount = await Player.countDocuments({ tournamentId: tournament._id });
    const pendingCount = await Player.countDocuments({ tournamentId: tournament._id, status: 'PENDING' });

    return res.json({
      success: true,
      data: {
        ...tournament.toObject(),
        hasStartedBidding: tournament.hasStartedBidding || Boolean(session?.hasBidsPlaced),
        teamCount,
        playerCount,
        pendingCount
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateAuctionFormat(req, res) {
  try {
    const { id } = req.params;
    const { format, resetAuction } = req.body;

    if (!['POINTS', 'MONEY'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction format. Must be POINTS or MONEY.'
      });
    }

    // SERVER-AUTHORITATIVE ROLE CHECK:
    // Only ORG_OWNER, ORG_ADMIN, TOURNAMENT_ORGANISER, TOURNAMENT_ADMIN, or SUPER_ADMIN can alter format.
    // Never trust a role passed in req.body!
    const effectiveRole = req.userContext?.effectiveRole || req.userContext?.orgRole || req.userContext?.tournamentRole;
    const allowedRoles = ['SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_ORGANISER', 'TOURNAMENT_ADMIN'];

    if (!req.userContext?.isSuperAdmin && (!effectiveRole || !allowedRoles.includes(effectiveRole))) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Only authorised Tournament Administrators can modify tournament auction format.'
      });
    }

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    // Cross-tenant IDOR validation: If orgId context exists, tournament must belong to it
    if (req.userContext?.orgId && String(tournament.organisationId) !== String(req.userContext.orgId) && !req.userContext?.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Cross-tenant violation: Tournament does not belong to your active organisation.'
      });
    }

    const session = await AuctionSession.findOne({ tournamentId: tournament._id });
    const isBiddingActive = tournament.hasStartedBidding || Boolean(session?.hasBidsPlaced);

    // Business rule: Once bidding starts, prevent changing auction format unless explicit reset workflow
    if (isBiddingActive && !resetAuction) {
      return res.status(400).json({
        success: false,
        isLocked: true,
        message: 'Action prohibited: Bidding has already commenced for this tournament. The auction format cannot be modified mid-auction without an explicit authorised reset.'
      });
    }

    // If reset is requested, reset bidding locks
    if (resetAuction) {
      tournament.hasStartedBidding = false;
      tournament.bidsCount = 0;
      if (session) {
        session.hasBidsPlaced = false;
        session.bidCount = 0;
        session.currentBidAmount = 0;
        await session.save();
      }

      await AuditLog.create({
        actorUserId: req.user?._id,
        organisationId: tournament.organisationId,
        tournamentId: tournament._id,
        action: 'AUCTION_RESET',
        entityType: 'Tournament',
        entityId: String(tournament._id),
        details: { resetByRole: effectiveRole },
        ipAddress: req.ip || ''
      });
    }

    // Persist new format in MongoDB
    tournament.auctionType = format;
    tournament.currencyCode = format === 'POINTS' ? 'PTS' : 'LKR';
    tournament.purseDisplay = format === 'POINTS' ? '100,000 Points' : 'LKR 10,000,000';

    await tournament.save();

    await AuditLog.create({
      actorUserId: req.user?._id,
      organisationId: tournament.organisationId,
      tournamentId: tournament._id,
      action: 'AUCTION_FORMAT_UPDATED',
      entityType: 'Tournament',
      entityId: String(tournament._id),
      details: { format, currencyCode: tournament.currencyCode },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Tournament auction format successfully updated to ${format} (${tournament.currencyCode})`,
      data: tournament
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function toggleBiddingLock(req, res) {
  try {
    const { id } = req.params;
    const { hasStartedBidding } = req.body;

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    tournament.hasStartedBidding = Boolean(hasStartedBidding);
    await tournament.save();

    const session = await AuctionSession.findOne({ tournamentId: tournament._id });
    if (session) {
      session.hasBidsPlaced = Boolean(hasStartedBidding);
      await session.save();
    }

    return res.json({
      success: true,
      message: `Bidding lock state set to ${tournament.hasStartedBidding}`,
      data: { hasStartedBidding: tournament.hasStartedBidding }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
