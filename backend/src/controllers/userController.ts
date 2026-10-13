import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { reconcileUserGamification } from '../services/gamificationService';

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function toSafeUser(user: IUser) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.passwordHash;
  const rawLevel = obj.level as unknown;
  obj.level = typeof rawLevel === 'number' && !Number.isNaN(rawLevel) ? rawLevel : 1;
  obj.xp = typeof obj.xp === 'number' && !Number.isNaN(obj.xp) ? obj.xp : 0;
  return obj;
}

// ── GET /api/users/me ─────────────────────────────────────────────────────────

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Authentication required.' } });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found.' } });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: toSafeUser(user),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to fetch user profile.' } });
  }
};

// ── PATCH /api/users/me ────────────────────────────────────────────────────────

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Authentication required.' } });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found.' } });
      return;
    }

    const { name, displayName, username, avatarUrl, bio, learningGoal, todayGoal, weeklyGoal } = req.body;

    // Validate Name / Display Name
    const newName = name !== undefined ? name : displayName;
    if (newName !== undefined) {
      if (typeof newName !== 'string' || newName.trim().length === 0) {
        res.status(400).json({ success: false, error: { message: 'Name cannot be empty.' } });
        return;
      }
      if (newName.trim().length > 50) {
        res.status(400).json({ success: false, error: { message: 'Name cannot exceed 50 characters.' } });
        return;
      }
      user.name = newName.trim();
      user.initials = getInitials(user.name);
    }

    // Validate Username
    if (username !== undefined) {
      if (typeof username !== 'string' || username.trim().length < 3) {
        res.status(400).json({ success: false, error: { message: 'Username must be at least 3 characters long.' } });
        return;
      }
      if (username.trim().length > 30) {
        res.status(400).json({ success: false, error: { message: 'Username cannot exceed 30 characters.' } });
        return;
      }
      const normalizedUsername = username.trim().toLowerCase();
      // Username characters check
      if (!/^[a-zA-Z0-9_-]+$/.test(normalizedUsername)) {
        res.status(400).json({
          success: false,
          error: { message: 'Username can only contain letters, numbers, underscores, and hyphens.' },
        });
        return;
      }

      // Check uniqueness against other users
      if (normalizedUsername !== user.username) {
        const existing = await User.findOne({ username: normalizedUsername, _id: { $ne: user._id } });
        if (existing) {
          res.status(400).json({ success: false, error: { message: 'This username is already taken.' } });
          return;
        }
        user.username = normalizedUsername;
      }
    }

    // Validate Avatar URL
    if (avatarUrl !== undefined) {
      if (typeof avatarUrl === 'string') {
        const trimmed = avatarUrl.trim();
        if (trimmed.length > 0 && !trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
          res.status(400).json({ success: false, error: { message: 'Avatar must be a valid URL (http/https).' } });
          return;
        }
        user.avatarUrl = trimmed;
      }
    }

    // Validate Bio
    if (bio !== undefined) {
      if (typeof bio === 'string') {
        if (bio.length > 500) {
          res.status(400).json({ success: false, error: { message: 'Bio cannot exceed 500 characters.' } });
          return;
        }
        user.bio = bio.trim();
      }
    }

    // Validate Learning Goal
    if (learningGoal !== undefined) {
      if (typeof learningGoal === 'string') {
        if (learningGoal.length > 100) {
          res.status(400).json({ success: false, error: { message: 'Learning goal cannot exceed 100 characters.' } });
          return;
        }
        user.learningGoal = learningGoal.trim();
      }
    }

    // Validate Goals
    if (todayGoal !== undefined) {
      const tg = Number(todayGoal);
      if (!isNaN(tg) && tg >= 0.5 && tg <= 24) {
        user.todayGoal = Math.round(tg * 10) / 10;
      }
    }

    if (weeklyGoal !== undefined) {
      const wg = Number(weeklyGoal);
      if (!isNaN(wg) && wg >= 1 && wg <= 168) {
        user.weeklyGoal = Math.round(wg * 10) / 10;
      }
    }

    await user.save();
    await reconcileUserGamification(req.userId);

    const refreshed = await User.findById(req.userId);

    res.status(200).json({
      success: true,
      data: {
        user: toSafeUser(refreshed || user),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to update profile.' } });
  }
};

// ── PATCH /api/users/me/password ──────────────────────────────────────────────

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Authentication required.' } });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        error: { message: 'Current password, new password, and confirmation are required.' },
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: { message: 'New password and confirmation do not match.' },
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        error: { message: 'New password must be at least 6 characters long.' },
      });
      return;
    }

    const user = await User.findById(req.userId).select('+passwordHash');
    if (!user || !user.passwordHash) {
      res.status(404).json({ success: false, error: { message: 'User not found.' } });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, error: { message: 'Current password is incorrect.' } });
      return;
    }

    // Hash new password
    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        message: 'Password changed successfully.',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Failed to change password.' } });
  }
};

// ── Additional user endpoints (stub / fallback) ───────────────────────────────

export const getUsers = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, 'name username initials avatarUrl streak totalHours level');
    res.status(200).json({ success: true, data: { users } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found.' } });
      return;
    }
    res.status(200).json({ success: true, data: { user: toSafeUser(user) } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
