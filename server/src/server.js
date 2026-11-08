import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`[CricketBid API Engine]: Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
