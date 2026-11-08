import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import tournamentRoutes from './routes/tournamentRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), service: 'CricketBid API' });
});

// API Routes
app.use('/api/v1/tournaments', tournamentRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/teams', teamRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
