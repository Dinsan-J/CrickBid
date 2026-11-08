import express from 'express';
import {
  getMembers,
  inviteMember,
  updateMember,
  removeMember,
  resendInvitation,
  revokeInvitation
} from '../controllers/organisationController.js';
import { authenticate, resolveContext, requireOrgRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(resolveContext);

router.get('/:orgId/members', requireOrgRole(['ORG_OWNER', 'ORG_ADMIN']), getMembers);
router.post('/:orgId/invitations', requireOrgRole(['ORG_OWNER', 'ORG_ADMIN']), inviteMember);
router.patch('/:orgId/members/:memberId', requireOrgRole(['ORG_OWNER', 'ORG_ADMIN']), updateMember);
router.delete('/:orgId/members/:memberId', requireOrgRole(['ORG_OWNER', 'ORG_ADMIN']), removeMember);
router.post('/:orgId/invitations/:inviteId/resend', requireOrgRole(['ORG_OWNER', 'ORG_ADMIN']), resendInvitation);
router.delete('/:orgId/invitations/:inviteId', requireOrgRole(['ORG_OWNER', 'ORG_ADMIN']), revokeInvitation);

export default router;
