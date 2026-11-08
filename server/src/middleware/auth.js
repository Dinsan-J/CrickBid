import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Organisation } from '../models/Organisation.js';
import { OrganisationMember } from '../models/OrganisationMember.js';
import { Tournament } from '../models/Tournament.js';
import { TournamentStaff } from '../models/TournamentStaff.js';

const JWT_SECRET = process.env.JWT_SECRET || 'crickbid_jwt_secret_dev_key_2026';

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      platformRole: user.platformRole
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

/**
 * Authentication Middleware: Verifies JWT token and attaches user
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in with a valid account.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session invalid. Account may have been deleted.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

/**
 * Optional Authentication: Attaches req.user if token is present, continues otherwise
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Ignore optional auth failures
  }
  next();
}

/**
 * Context & Scope Resolver:
 * Authoritatively determines user's role for the specified organisation and tournament.
 * Prevents IDOR and cross-tenant access.
 */
export async function resolveContext(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const orgId = req.headers['x-org-id'] || req.params.orgId || req.query.orgId;
    const tournamentId = req.headers['x-tournament-id'] || req.params.trnId || req.params.tournamentId || req.query.tournamentId;

    const isSuperAdmin = req.user.platformRole === 'SUPER_ADMIN';

    let orgRole = null;
    let tournamentRole = null;
    let assignedTeamId = null;
    let activeOrg = null;
    let activeTournament = null;

    // 1. Resolve Organisation Context
    if (orgId) {
      activeOrg = await Organisation.findById(orgId);
      if (!activeOrg && !isSuperAdmin) {
        return res.status(404).json({ success: false, message: 'Organisation not found' });
      }

      const membership = await OrganisationMember.findOne({
        organisationId: orgId,
        userId: req.user._id,
        status: 'ACTIVE'
      });

      if (membership) {
        orgRole = membership.role;
      } else if (!isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not hold active membership in this organisation.'
        });
      } else {
        orgRole = 'SUPER_ADMIN';
      }
    }

    // 2. Resolve Tournament Context
    if (tournamentId) {
      activeTournament = await Tournament.findById(tournamentId);
      if (!activeTournament && !isSuperAdmin) {
        return res.status(404).json({ success: false, message: 'Tournament not found' });
      }

      // Check if user is Org Owner or Org Admin for the tournament's organisation
      if (orgRole === 'ORG_OWNER' || orgRole === 'ORG_ADMIN' || isSuperAdmin) {
        tournamentRole = 'TOURNAMENT_ADMIN';
      } else {
        const staff = await TournamentStaff.findOne({
          tournamentId,
          userId: req.user._id,
          status: 'ACTIVE'
        });

        if (staff) {
          tournamentRole = staff.role;
          assignedTeamId = staff.assignedTeamId;
        } else {
          tournamentRole = 'SPECTATOR';
        }
      }
    }

    // 3. Attach Server-Authoritative Context to Request
    req.userContext = {
      isSuperAdmin,
      orgId,
      orgRole,
      tournamentId,
      tournamentRole,
      assignedTeamId,
      effectiveRole: tournamentRole || orgRole || (isSuperAdmin ? 'SUPER_ADMIN' : 'SPECTATOR')
    };

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * Require Organisation Role Middleware:
 * e.g. requireOrgRole(['ORG_OWNER', 'ORG_ADMIN'])
 */
export function requireOrgRole(allowedRoles = []) {
  return (req, res, next) => {
    if (req.userContext?.isSuperAdmin) return next();

    const role = req.userContext?.orgRole;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Action prohibited: Requires one of [${allowedRoles.join(', ')}] in this organisation.`
      });
    }
    next();
  };
}

/**
 * Require Tournament Role Middleware:
 * e.g. requireTournamentRole(['TOURNAMENT_ADMIN', 'AUCTIONEER'])
 */
export function requireTournamentRole(allowedRoles = []) {
  return (req, res, next) => {
    if (req.userContext?.isSuperAdmin) return next();

    const role = req.userContext?.tournamentRole;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Action prohibited: Requires one of [${allowedRoles.join(', ')}] in this tournament.`
      });
    }
    next();
  };
}

/**
 * Require Super Administrator
 */
export function requireSuperAdmin(req, res, next) {
  if (req.user?.platformRole === 'SUPER_ADMIN') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Requires Platform Super Administrator privileges.'
  });
}
