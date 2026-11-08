import express from 'express';
import { createOrganisation, acceptInvitation } from '../controllers/onboardingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-org', authenticate, createOrganisation);
router.post('/accept-invite', authenticate, acceptInvitation);

export default router;
