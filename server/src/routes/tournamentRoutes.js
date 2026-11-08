import express from 'express';
import {
  getActiveTournament,
  updateAuctionFormat,
  toggleBiddingLock
} from '../controllers/tournamentController.js';

const router = express.Router();

router.get('/active', getActiveTournament);
router.patch('/:id/auction-format', updateAuctionFormat);
router.patch('/:id/toggle-bidding', toggleBiddingLock);

export default router;
