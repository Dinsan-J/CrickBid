import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  registerPlayer,
  getPlayers,
  getPlayerById,
  updatePlayerStatus
} from '../controllers/playerController.js';

const router = express.Router();

// Setup Multer Storage
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/register', upload.single('photo'), registerPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.patch('/:id/status', updatePlayerStatus);

export default router;
