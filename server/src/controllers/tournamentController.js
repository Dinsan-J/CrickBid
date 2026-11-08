import { Tournament } from '../models/Tournament.js';
import { AuctionSession } from '../models/AuctionSession.js';
import { Player } from '../models/Player.js';
import { Team } from '../models/Team.js';

export async function getActiveTournament(req, res) {
  try {
    let tournament = await Tournament.findOne({ slug: 'mca-premier-league-2026' });
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
    const { format, userRole, resetAuction } = req.body;

    if (!['POINTS', 'MONEY'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid auction format. Must be POINTS or MONEY.'
      });
    }

    // Role check: Only PLATFORM_ADMIN or ORGANISER can change format
    const allowedRoles = ['PLATFORM_ADMIN', 'ORGANISER'];
    if (userRole && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Only Tournament Organisers or Platform Administrators can modify tournament auction format.'
      });
    }

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
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
    }

    // Persist new format in MongoDB
    tournament.auctionType = format;
    tournament.currencyCode = format === 'POINTS' ? 'PTS' : 'LKR';
    tournament.purseDisplay = format === 'POINTS' ? '100,000 Points' : 'LKR 10,000,000';

    await tournament.save();

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
