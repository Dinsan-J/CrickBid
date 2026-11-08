import express from 'express';
import {
  getActiveTournament,
  updateAuctionFormat,
  toggleBiddingLock
} from '../controllers/tournamentController.js';
import {
  getStaff,
  inviteStaff,
  removeStaff
} from '../controllers/tournamentStaffController.js';
import { authenticate, resolveContext, optionalAuth, requireTournamentRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', optionalAuth, resolveContext, getActiveTournament);
router.patch('/:id/auction-format', authenticate, resolveContext, updateAuctionFormat);
router.patch('/:id/toggle-bidding', authenticate, resolveContext, toggleBiddingLock);

// Tournament Staff Management
router.get('/:trnId/staff', authenticate, resolveContext, getStaff);
router.post('/:trnId/invitations', authenticate, resolveContext, requireTournamentRole(['TOURNAMENT_ADMIN']), inviteStaff);
router.delete('/:trnId/staff/:staffId', authenticate, resolveContext, requireTournamentRole(['TOURNAMENT_ADMIN']), removeStaff);

export default router;
