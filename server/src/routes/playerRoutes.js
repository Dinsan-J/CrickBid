import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  registerPlayer,
  getPlayers,
  getPlayerById,
  updatePlayerStatus
} from '../controllers/playerController.js';
import { authenticate, resolveContext, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'player-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Public player registration (self-service)
router.post('/register', upload.single('photo'), registerPlayer);

// List & view players
router.get('/', optionalAuth, resolveContext, getPlayers);
router.get('/:id', optionalAuth, resolveContext, getPlayerById);

// Organiser review approval / rejection (strictly server-authoritative)
router.patch('/:id/status', authenticate, resolveContext, updatePlayerStatus);

export default router;
