import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import logRoutes from './routes/logRoutes';
import squadRoutes from './routes/squadRoutes';
import badgeRoutes from './routes/badgeRoutes';
import gamificationRoutes from './routes/gamificationRoutes';
import goalRoutes from './routes/goalRoutes';
import aiRoutes from './routes/aiRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8443';

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:8443', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/daily-logs', logRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/ai', aiRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start Listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 DevTrack Backend API Server running on port ${PORT}`);
    console.log(`📡 Health check endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  });
}

export default app;
