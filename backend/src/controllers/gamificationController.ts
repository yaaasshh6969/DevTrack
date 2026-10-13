import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import {
  listBadgesForUser,
  reconcileUserGamification,
} from '../services/gamificationService';

export const getGamification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const snapshot = await reconcileUserGamification(req.userId);
    if (!snapshot) {
      res.status(404).json({ success: false, error: { message: 'User not found.' } });
      return;
    }

    res.status(200).json({ success: true, data: snapshot });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to load gamification.' },
    });
  }
};

export const getGoals = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const snapshot = await reconcileUserGamification(req.userId);
    if (!snapshot) {
      res.status(404).json({ success: false, error: { message: 'User not found.' } });
      return;
    }

    res.status(200).json({ success: true, data: { goals: snapshot.goals } });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to load goals.' },
    });
  }
};

export const getBadges = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
      return;
    }

    const badges = await listBadgesForUser(req.userId);
    res.status(200).json({ success: true, data: { badges } });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to load badges.' },
    });
  }
};
