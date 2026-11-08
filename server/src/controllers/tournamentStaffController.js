import crypto from 'crypto';
import { Tournament } from '../models/Tournament.js';
import { TournamentStaff } from '../models/TournamentStaff.js';
import { Invitation } from '../models/Invitation.js';
import { AuditLog } from '../models/AuditLog.js';
import { User } from '../models/User.js';

export async function getStaff(req, res) {
  try {
    const { trnId } = req.params;

    const tournament = await Tournament.findById(trnId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    const staffMembers = await TournamentStaff.find({ tournamentId: trnId })
      .populate('userId', 'name email avatar phone')
      .populate('assignedTeamId', 'name shortCode primaryColorHex')
      .sort({ createdAt: 1 });

    const pendingInvitations = await Invitation.find({
      tournamentId: trnId,
      scope: 'TOURNAMENT',
      status: 'PENDING'
    }).populate('assignedTeamId', 'name shortCode').sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        staff: staffMembers.map(s => ({
          id: s._id,
          userId: s.userId?._id,
          name: s.userId?.name || 'Unknown',
          email: s.userId?.email || '',
          avatar: s.userId?.avatar,
          role: s.role,
          assignedTeam: s.assignedTeamId ? {
            id: s.assignedTeamId._id,
            name: s.assignedTeamId.name,
            shortCode: s.assignedTeamId.shortCode,
            color: s.assignedTeamId.primaryColorHex
          } : null,
          status: s.status,
          assignedAt: s.createdAt
        })),
        invitations: pendingInvitations.map(inv => ({
          id: inv._id,
          email: inv.email,
          role: inv.role,
          token: inv.token,
          assignedTeam: inv.assignedTeamId ? {
            id: inv.assignedTeamId._id,
            name: inv.assignedTeamId.name,
            shortCode: inv.assignedTeamId.shortCode
          } : null,
          status: inv.status,
          expiresAt: inv.expiresAt,
          createdAt: inv.createdAt
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function inviteStaff(req, res) {
  try {
    const { trnId } = req.params;
    const { email, role, assignedTeamId } = req.body;

    const tournament = await Tournament.findById(trnId);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }

    const allowedRoles = [
      'TOURNAMENT_ADMIN',
      'AUCTIONEER',
      'TEAM_OWNER',
      'TEAM_MANAGER',
      'PLAYER',
      'BROADCAST_OPERATOR'
    ];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid tournament role. Allowed roles: [${allowedRoles.join(', ')}]`
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is already assigned to this tournament with this role
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const existingStaff = await TournamentStaff.findOne({
        tournamentId: trnId,
        userId: existingUser._id,
        role
      });
      if (existingStaff) {
        return res.status(409).json({
          success: false,
          message: `User ${normalizedEmail} is already active as ${role} in this tournament.`
        });
      }
    }

    const token = 'trn_inv_' + crypto.randomBytes(20).toString('hex');

    const invitation = await Invitation.create({
      email: normalizedEmail,
      organisationId: tournament.organisationId,
      tournamentId: trnId,
      scope: 'TOURNAMENT',
      role,
      assignedTeamId: assignedTeamId || null,
      token,
      invitedBy: req.user._id,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: tournament.organisationId,
      tournamentId: trnId,
      action: 'TOURNAMENT_STAFF_INVITED',
      entityType: 'Invitation',
      entityId: String(invitation._id),
      details: { email: normalizedEmail, role, token },
      ipAddress: req.ip || ''
    });

    return res.status(201).json({
      success: true,
      message: `Tournament staff invitation sent to ${normalizedEmail} for ${role}.`,
      data: invitation
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function removeStaff(req, res) {
  try {
    const { trnId, staffId } = req.params;

    const staff = await TournamentStaff.findOne({ _id: staffId, tournamentId: trnId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Tournament staff assignment not found' });
    }

    await TournamentStaff.deleteOne({ _id: staffId });

    await AuditLog.create({
      actorUserId: req.user._id,
      tournamentId: trnId,
      action: 'TOURNAMENT_STAFF_REMOVED',
      entityType: 'TournamentStaff',
      entityId: String(staffId),
      details: { removedUserId: String(staff.userId), role: staff.role },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Staff role ${staff.role} removed. Access immediately revoked.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
