import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Organisation } from '../models/Organisation.js';
import { OrganisationMember } from '../models/OrganisationMember.js';
import { Tournament } from '../models/Tournament.js';
import { TournamentStaff } from '../models/TournamentStaff.js';
import { AuditLog } from '../models/AuditLog.js';
import { signToken } from '../middleware/auth.js';

export async function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
      platformRole: 'NONE', // Standard new user never receives platform admin!
      isEmailVerified: true // Auto-verify in dev
    });

    await AuditLog.create({
      actorUserId: user._id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: String(user._id),
      details: { email: user.email, name: user.name },
      ipAddress: req.ip || ''
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        platformRole: user.platformRole,
        availableOrganisations: [],
        availableTournaments: [],
        activeOrganisation: null,
        activeTournament: null,
        effectiveRole: 'SPECTATOR',
        needsOnboarding: true
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    // Load User's Organisation Memberships
    const memberships = await OrganisationMember.find({
      userId: user._id,
      status: 'ACTIVE'
    }).populate('organisationId');

    let availableOrganisations = memberships
      .filter(m => m.organisationId)
      .map(m => ({
        id: m.organisationId._id,
        name: m.organisationId.name,
        slug: m.organisationId.slug,
        logo: m.organisationId.logoUrl,
        role: m.role
      }));

    // Also load tournaments where user is directly assigned as Tournament Staff
    const staffAssignments = await TournamentStaff.find({
      userId: user._id,
      status: 'ACTIVE'
    }).populate('tournamentId').populate('organisationId');

    // Add organisations from tournament staff assignments if not already present
    staffAssignments.forEach(s => {
      if (s.organisationId && !availableOrganisations.some(o => String(o.id) === String(s.organisationId._id))) {
        availableOrganisations.push({
          id: s.organisationId._id,
          name: s.organisationId.name,
          slug: s.organisationId.slug,
          logo: s.organisationId.logoUrl,
          role: s.role // Tournament-level scoped role in this org
        });
      }
    });

    // Choose active organization (first available, or null)
    const activeOrg = availableOrganisations[0] || null;

    // Load User's Tournament Assignments
    let availableTournaments = [];
    if (activeOrg) {
      const isOrgAdmin = ['ORG_OWNER', 'ORG_ADMIN'].includes(activeOrg.role);
      if (isOrgAdmin || user.platformRole === 'SUPER_ADMIN') {
        const orgTournaments = await Tournament.find({ organisationId: activeOrg.id });
        availableTournaments = orgTournaments.map(t => ({
          id: t._id,
          name: t.name,
          slug: t.slug,
          auctionType: t.auctionType,
          currency: t.currencyCode,
          role: 'TOURNAMENT_ADMIN'
        }));
      } else {
        availableTournaments = staffAssignments
          .filter(s => s.tournamentId && String(s.organisationId?._id || s.tournamentId.organisationId) === String(activeOrg.id))
          .map(s => ({
            id: s.tournamentId._id,
            name: s.tournamentId.name,
            slug: s.tournamentId.slug,
            auctionType: s.tournamentId.auctionType,
            currency: s.tournamentId.currencyCode,
            role: s.role,
            assignedTeamId: s.assignedTeamId
          }));
      }
    }

    const activeTournament = availableTournaments[0] || null;

    // Compute Effective Server-Authoritative Role
    let effectiveRole = 'SPECTATOR';
    if (user.platformRole === 'SUPER_ADMIN') {
      effectiveRole = 'SUPER_ADMIN';
    } else if (activeTournament?.role) {
      effectiveRole = activeTournament.role;
    } else if (activeOrg?.role) {
      effectiveRole = activeOrg.role;
    }

    const token = signToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        platformRole: user.platformRole,
        availableOrganisations,
        availableTournaments,
        activeOrganisation: activeOrg,
        activeTournament,
        effectiveRole,
        needsOnboarding: availableOrganisations.length === 0 && user.platformRole === 'NONE'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = req.user;

    // Load User's Organisation Memberships
    const memberships = await OrganisationMember.find({
      userId: user._id,
      status: 'ACTIVE'
    }).populate('organisationId');

    const availableOrganisations = memberships
      .filter(m => m.organisationId)
      .map(m => ({
        id: m.organisationId._id,
        name: m.organisationId.name,
        slug: m.organisationId.slug,
        logo: m.organisationId.logoUrl,
        role: m.role
      }));

    // Requested active context from header or default to first
    const requestedOrgId = req.headers['x-org-id'];
    let activeOrg = availableOrganisations.find(o => String(o.id) === String(requestedOrgId)) || availableOrganisations[0] || null;

    let availableTournaments = [];
    if (activeOrg) {
      const isOrgAdmin = ['ORG_OWNER', 'ORG_ADMIN'].includes(activeOrg.role);
      if (isOrgAdmin || user.platformRole === 'SUPER_ADMIN') {
        const orgTournaments = await Tournament.find({ organisationId: activeOrg.id });
        availableTournaments = orgTournaments.map(t => ({
          id: t._id,
          name: t.name,
          slug: t.slug,
          auctionType: t.auctionType,
          currency: t.currencyCode,
          role: 'TOURNAMENT_ADMIN'
        }));
      } else {
        const staffAssignments = await TournamentStaff.find({
          userId: user._id,
          status: 'ACTIVE'
        }).populate('tournamentId');

        availableTournaments = staffAssignments
          .filter(s => s.tournamentId)
          .map(s => ({
            id: s.tournamentId._id,
            name: s.tournamentId.name,
            slug: s.tournamentId.slug,
            auctionType: s.tournamentId.auctionType,
            currency: s.tournamentId.currencyCode,
            role: s.role,
            assignedTeamId: s.assignedTeamId
          }));
      }
    }

    const requestedTrnId = req.headers['x-tournament-id'];
    let activeTournament = availableTournaments.find(t => String(t.id) === String(requestedTrnId)) || availableTournaments[0] || null;

    let effectiveRole = 'SPECTATOR';
    if (user.platformRole === 'SUPER_ADMIN') {
      effectiveRole = 'SUPER_ADMIN';
    } else if (activeTournament?.role) {
      effectiveRole = activeTournament.role;
    } else if (activeOrg?.role) {
      effectiveRole = activeOrg.role;
    }

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        platformRole: user.platformRole,
        availableOrganisations,
        availableTournaments,
        activeOrganisation: activeOrg,
        activeTournament,
        effectiveRole,
        needsOnboarding: availableOrganisations.length === 0 && user.platformRole === 'NONE'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
