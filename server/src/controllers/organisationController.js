import crypto from 'crypto';
import { Organisation } from '../models/Organisation.js';
import { OrganisationMember } from '../models/OrganisationMember.js';
import { TournamentStaff } from '../models/TournamentStaff.js';
import { Invitation } from '../models/Invitation.js';
import { AuditLog } from '../models/AuditLog.js';
import { User } from '../models/User.js';

export async function getMembers(req, res) {
  try {
    const { orgId } = req.params;

    const members = await OrganisationMember.find({ organisationId: orgId })
      .populate('userId', 'name email avatar phone lastLoginAt')
      .sort({ createdAt: 1 });

    const pendingInvitations = await Invitation.find({
      organisationId: orgId,
      scope: 'ORGANISATION',
      status: 'PENDING'
    }).populate('invitedBy', 'name email').sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        members: members.map(m => ({
          id: m._id,
          userId: m.userId?._id,
          name: m.userId?.name || 'Unknown',
          email: m.userId?.email || '',
          avatar: m.userId?.avatar,
          phone: m.userId?.phone,
          role: m.role,
          status: m.status,
          joinedAt: m.createdAt
        })),
        invitations: pendingInvitations.map(inv => ({
          id: inv._id,
          email: inv.email,
          role: inv.role,
          token: inv.token,
          status: inv.status,
          expiresAt: inv.expiresAt,
          invitedBy: inv.invitedBy?.name || 'Admin',
          createdAt: inv.createdAt
        }))
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function inviteMember(req, res) {
  try {
    const { orgId } = req.params;
    const { email, role } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const allowedRoles = ['ORG_ADMIN', 'TOURNAMENT_ORGANISER'];
    // Only existing ORG_OWNER or SUPER_ADMIN can invite another ORG_OWNER
    if (req.userContext?.orgRole === 'ORG_OWNER' || req.userContext?.isSuperAdmin) {
      allowedRoles.push('ORG_OWNER');
    }

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles for your authorization level: [${allowedRoles.join(', ')}]`
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user is already an active member of this organisation
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const existingMember = await OrganisationMember.findOne({
        organisationId: orgId,
        userId: existingUser._id
      });
      if (existingMember) {
        return res.status(409).json({
          success: false,
          message: `User ${normalizedEmail} is already a member of this organisation with role: ${existingMember.role}.`
        });
      }
    }

    // Generate secure random token
    const token = 'inv_' + crypto.randomBytes(20).toString('hex');

    // Create or update pending invitation
    const invitation = await Invitation.create({
      email: normalizedEmail,
      organisationId: orgId,
      scope: 'ORGANISATION',
      role,
      token,
      invitedBy: req.user._id,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: orgId,
      action: 'MEMBER_INVITED',
      entityType: 'Invitation',
      entityId: String(invitation._id),
      details: { email: normalizedEmail, role, token },
      ipAddress: req.ip || ''
    });

    return res.status(201).json({
      success: true,
      message: `Invitation successfully sent to ${normalizedEmail} as ${role}.`,
      data: invitation
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateMember(req, res) {
  try {
    const { orgId, memberId } = req.params;
    const { role, status } = req.body;

    const member = await OrganisationMember.findOne({ _id: memberId, organisationId: orgId });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Organisation member not found' });
    }

    // Protection: Only ORG_OWNER or SUPER_ADMIN can demote/modify another ORG_OWNER
    if (member.role === 'ORG_OWNER' && req.userContext?.orgRole !== 'ORG_OWNER' && !req.userContext?.isSuperAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Cannot modify the Organisation Owner.'
      });
    }

    if (role) {
      member.role = role;
    }
    if (status && ['ACTIVE', 'SUSPENDED'].includes(status)) {
      member.status = status;
    }

    await member.save();

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: orgId,
      action: 'MEMBER_ROLE_UPDATED',
      entityType: 'OrganisationMember',
      entityId: String(member._id),
      details: { newRole: member.role, newStatus: member.status },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Member updated successfully.`,
      data: member
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function removeMember(req, res) {
  try {
    const { orgId, memberId } = req.params;

    const member = await OrganisationMember.findOne({ _id: memberId, organisationId: orgId });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Organisation member not found' });
    }

    // Prevent removing the Organisation Owner
    if (member.role === 'ORG_OWNER') {
      return res.status(400).json({
        success: false,
        message: 'Prohibited: The Organisation Owner cannot be removed. Transfer ownership first.'
      });
    }

    // Immediately revoke access by deleting the OrganisationMember document
    await OrganisationMember.deleteOne({ _id: memberId });

    // Also remove any tournament staff assignments for this user under this organisation
    await TournamentStaff.deleteMany({ organisationId: orgId, userId: member.userId });

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: orgId,
      action: 'MEMBER_REMOVED',
      entityType: 'OrganisationMember',
      entityId: String(memberId),
      details: { removedUserId: String(member.userId), role: member.role },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: 'Member removed and access immediately revoked.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function resendInvitation(req, res) {
  try {
    const { orgId, inviteId } = req.params;

    const invitation = await Invitation.findOne({ _id: inviteId, organisationId: orgId });
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    invitation.status = 'PENDING';
    await invitation.save();

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: orgId,
      action: 'INVITATION_RESENT',
      entityType: 'Invitation',
      entityId: String(invitation._id),
      details: { email: invitation.email, token: invitation.token },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Invitation resent to ${invitation.email}.`,
      data: invitation
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function revokeInvitation(req, res) {
  try {
    const { orgId, inviteId } = req.params;

    const invitation = await Invitation.findOne({ _id: inviteId, organisationId: orgId });
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    invitation.status = 'REVOKED';
    await invitation.save();

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: orgId,
      action: 'INVITATION_REVOKED',
      entityType: 'Invitation',
      entityId: String(invitation._id),
      details: { email: invitation.email },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Invitation for ${invitation.email} has been revoked.`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
