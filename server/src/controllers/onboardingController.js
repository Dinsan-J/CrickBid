import { Organisation } from '../models/Organisation.js';
import { OrganisationMember } from '../models/OrganisationMember.js';
import { Tournament } from '../models/Tournament.js';
import { TournamentStaff } from '../models/TournamentStaff.js';
import { Invitation } from '../models/Invitation.js';
import { AuditLog } from '../models/AuditLog.js';

export async function createOrganisation(req, res) {
  try {
    const { name, slug, contactEmail, contactPhone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Organisation name is required' });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existingOrg = await Organisation.findOne({ slug: cleanSlug });
    if (existingOrg) {
      return res.status(409).json({
        success: false,
        message: `Organisation identifier '${cleanSlug}' is already taken. Please choose another slug.`
      });
    }

    // 1. Create Organisation
    const org = await Organisation.create({
      name: name.trim(),
      slug: cleanSlug,
      ownerId: req.user._id,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone || ''
    });

    // 2. IMPORTANT BUSINESS RULE:
    // Creating an organisation assigns the creator the ORG_OWNER role for that organisation only.
    // It must NEVER assign Platform Administrator privileges.
    await OrganisationMember.create({
      organisationId: org._id,
      userId: req.user._id,
      role: 'ORG_OWNER',
      status: 'ACTIVE'
    });

    // 3. Log Audit Trail
    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: org._id,
      action: 'ORGANISATION_CREATED',
      entityType: 'Organisation',
      entityId: String(org._id),
      details: { name: org.name, slug: org.slug, roleAssigned: 'ORG_OWNER' },
      ipAddress: req.ip || ''
    });

    return res.status(201).json({
      success: true,
      message: `Organisation '${org.name}' created successfully. You are designated as Organisation Owner.`,
      data: {
        id: org._id,
        name: org.name,
        slug: org.slug,
        role: 'ORG_OWNER'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function acceptInvitation(req, res) {
  try {
    const { token } = req.body;

    if (!token || !token.trim()) {
      return res.status(400).json({ success: false, message: 'Invitation token is required' });
    }

    const invitation = await Invitation.findOne({ token: token.trim() });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation token. The invitation may have been deleted or never existed.'
      });
    }

    if (invitation.status === 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: 'This invitation has already been accepted and cannot be reused.'
      });
    }

    if (invitation.status === 'REVOKED') {
      return res.status(400).json({
        success: false,
        message: 'This invitation was revoked by the organisation administrator.'
      });
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = 'EXPIRED';
      await invitation.save();
      return res.status(400).json({
        success: false,
        message: 'This invitation token has expired. Please request a new invitation.'
      });
    }

    // Process Organisation or Tournament level acceptance
    if (invitation.scope === 'ORGANISATION') {
      await OrganisationMember.findOneAndUpdate(
        { organisationId: invitation.organisationId, userId: req.user._id },
        {
          organisationId: invitation.organisationId,
          userId: req.user._id,
          role: invitation.role,
          status: 'ACTIVE',
          invitedBy: invitation.invitedBy
        },
        { upsert: true, new: true }
      );
    } else if (invitation.scope === 'TOURNAMENT') {
      await TournamentStaff.findOneAndUpdate(
        { tournamentId: invitation.tournamentId, userId: req.user._id, role: invitation.role },
        {
          tournamentId: invitation.tournamentId,
          organisationId: invitation.organisationId,
          userId: req.user._id,
          role: invitation.role,
          assignedTeamId: invitation.assignedTeamId,
          status: 'ACTIVE',
          invitedBy: invitation.invitedBy
        },
        { upsert: true, new: true }
      );
    }

    invitation.status = 'ACCEPTED';
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = req.user._id;
    await invitation.save();

    await AuditLog.create({
      actorUserId: req.user._id,
      organisationId: invitation.organisationId,
      tournamentId: invitation.tournamentId,
      action: 'INVITATION_ACCEPTED',
      entityType: 'Invitation',
      entityId: String(invitation._id),
      details: { role: invitation.role, scope: invitation.scope },
      ipAddress: req.ip || ''
    });

    return res.json({
      success: true,
      message: `Invitation accepted! You have been granted the role of ${invitation.role}.`,
      data: {
        role: invitation.role,
        scope: invitation.scope,
        organisationId: invitation.organisationId,
        tournamentId: invitation.tournamentId
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
