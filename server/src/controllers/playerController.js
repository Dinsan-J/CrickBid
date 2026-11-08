import { Player } from '../models/Player.js';
import { Tournament } from '../models/Tournament.js';
import { AuditLog } from '../models/AuditLog.js';

export async function registerPlayer(req, res) {
  try {
    const {
      tournamentId,
      fullName,
      dob,
      gender,
      phone,
      whatsapp,
      district,
      town,
      playingRole,
      battingStyle,
      bowlingStyle,
      experience,
      additionalInfo,
      photoUrl,
      whatsappConsent
    } = req.body;

    // 1. Validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }
    if (!dob) {
      return res.status(400).json({ success: false, message: 'Date of birth is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }
    if (!whatsapp || !whatsapp.trim()) {
      return res.status(400).json({ success: false, message: 'WhatsApp number is required' });
    }
    if (!district || !district.trim()) {
      return res.status(400).json({ success: false, message: 'District is required' });
    }
    if (!town || !town.trim()) {
      return res.status(400).json({ success: false, message: 'Town is required' });
    }
    if (!playingRole) {
      return res.status(400).json({ success: false, message: 'Playing role is required' });
    }
    if (!battingStyle) {
      return res.status(400).json({ success: false, message: 'Batting style is required' });
    }

    // 2. Resolve Tournament
    let targetTournamentId = tournamentId;
    if (!targetTournamentId) {
      const activeTournament = await Tournament.findOne();
      if (!activeTournament) {
        return res.status(404).json({ success: false, message: 'No active tournament found to register with' });
      }
      targetTournamentId = activeTournament._id;
    }

    // 3. Prevent duplicate registration (Phone number check within the tournament)
    const existingPlayer = await Player.findOne({
      tournamentId: targetTournamentId,
      phone: phone.trim()
    });

    if (existingPlayer) {
      return res.status(409).json({
        success: false,
        message: `A registration with phone number ${phone} already exists (Registration ID: ${existingPlayer.registrationNumber}, Status: ${existingPlayer.status}). Duplicate submissions are prohibited.`
      });
    }

    // 4. Generate Registration Number (REG-2026-XXX)
    const count = await Player.countDocuments({ tournamentId: targetTournamentId });
    const regSeq = String(count + 1).padStart(3, '0');
    const registrationNumber = `REG-2026-${regSeq}`;

    // 5. Handle Photo (if uploaded via multer or sent as URL/base64)
    let finalPhotoUrl = photoUrl;
    if (req.file) {
      finalPhotoUrl = `/uploads/${req.file.filename}`;
    }
    if (!finalPhotoUrl || !finalPhotoUrl.trim()) {
      finalPhotoUrl = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80';
    }

    // 6. Create Player Document in MongoDB
    const player = await Player.create({
      tournamentId: targetTournamentId,
      registrationNumber,
      fullName: fullName.trim(),
      photoUrl: finalPhotoUrl,
      dob,
      gender: gender || 'Male',
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      district: district.trim(),
      town: town.trim(),
      playingRole,
      battingStyle,
      bowlingStyle: bowlingStyle || 'Right-Arm Medium',
      experience: experience ? experience.trim() : 'Club / School Cricket',
      additionalInfo: additionalInfo ? additionalInfo.trim() : '',
      whatsappConsent: whatsappConsent !== undefined ? Boolean(whatsappConsent) : true,
      status: 'PENDING',
      category: 'GOLD',
      basePrice: 50000,
      stats: {
        matches: Math.floor(Math.random() * 20) + 10,
        runs: Math.floor(Math.random() * 600) + 200,
        highestScore: `${Math.floor(Math.random() * 50) + 45}`,
        battingAverage: Number((Math.random() * 25 + 20).toFixed(1)),
        strikeRate: Number((Math.random() * 40 + 115).toFixed(1)),
        wickets: Math.floor(Math.random() * 15) + 5,
        bestBowling: '3/24',
        economy: Number((Math.random() * 2 + 6.5).toFixed(1)),
        catches: Math.floor(Math.random() * 10) + 2
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Player registered successfully. Your profile has been submitted for tournament organiser review.',
      data: player
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A player with this phone number or registration number already exists.'
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPlayers(req, res) {
  try {
    const { status, role, search, tournamentId } = req.query;

    let query = {};
    if (tournamentId) {
      query.tournamentId = tournamentId;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (role && role !== 'ALL') {
      query.playingRole = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { registrationNumber: searchRegex },
        { town: searchRegex },
        { district: searchRegex },
        { playingRole: searchRegex }
      ];
    }

    const players = await Player.find(query).sort({ createdAt: -1 });

    const totalCount = await Player.countDocuments(tournamentId ? { tournamentId } : {});
    const pendingCount = await Player.countDocuments({ ...(tournamentId ? { tournamentId } : {}), status: 'PENDING' });
    const approvedCount = await Player.countDocuments({ ...(tournamentId ? { tournamentId } : {}), status: { $in: ['APPROVED', 'UNDER_THE_HAMMER', 'SOLD'] } });
    const rejectedCount = await Player.countDocuments({ ...(tournamentId ? { tournamentId } : {}), status: 'REJECTED' });

    return res.json({
      success: true,
      count: players.length,
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount
      },
      data: players
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getPlayerById(req, res) {
  try {
    const { id } = req.params;
    const player = await Player.findById(id).populate('tournamentId', 'name auctionType currencyCode');

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    return res.json({
      success: true,
      data: player
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePlayerStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'SHORTLISTED', 'UNDER_THE_HAMMER', 'SOLD'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid player status.' });
    }

    // SERVER-AUTHORITATIVE PERMISSION CHECK:
    // Only TOURNAMENT_ADMIN, TOURNAMENT_ORGANISER, ORG_OWNER, ORG_ADMIN, or SUPER_ADMIN can approve/reject.
    // Never trust a role passed in req.body!
    const effectiveRole = req.userContext?.effectiveRole || req.userContext?.orgRole || req.userContext?.tournamentRole;
    const allowedRoles = ['SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_ORGANISER', 'TOURNAMENT_ADMIN'];

    if (!req.userContext?.isSuperAdmin && (!effectiveRole || !allowedRoles.includes(effectiveRole))) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Only authorised Tournament Organisers or Administrators can approve or reject player registrations.'
      });
    }

    const player = await Player.findById(id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    player.status = status;
    await player.save();

    await AuditLog.create({
      actorUserId: req.user?._id,
      tournamentId: player.tournamentId,
      action: 'PLAYER_STATUS_UPDATED',
      entityType: 'Player',
      entityId: String(player._id),
      details: { fullName: player.fullName, newStatus: status, updatedByRole: effectiveRole },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Player ${player.fullName} registration marked as ${status}.`,
      data: player
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
