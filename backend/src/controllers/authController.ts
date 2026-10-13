import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function toSafeUser(user: IUser) {
  const obj = user.toObject();
  delete obj.passwordHash;
  const rawLevel = obj.level as unknown;
  obj.level = typeof rawLevel === 'number' && !Number.isNaN(rawLevel) ? rawLevel : 1;
  obj.xp = typeof obj.xp === 'number' && !Number.isNaN(obj.xp) ? obj.xp : 0;
  return obj;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password, learningGoal } = req.body;

    // Validation
    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, error: { message: 'A valid email address is required.' } });
      return;
    }

    if (!username || username.trim().length < 3) {
      res.status(400).json({ success: false, error: { message: 'Username must be at least 3 characters long.' } });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({ success: false, error: { message: 'Password must be at least 6 characters long.' } });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const displayName = name && name.trim() ? name.trim() : username.trim();

    // Check existing duplicates
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      res.status(400).json({ success: false, error: { message: 'An account with this email already exists.' } });
      return;
    }

    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      res.status(400).json({ success: false, error: { message: 'This username is already taken.' } });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const initials = getInitials(displayName);

    // Create user
    const newUser = await User.create({
      name: displayName,
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      initials,
      learningGoal: learningGoal || 'Become a Full-Stack Developer',
    });

    const token = generateToken(newUser._id.toString());
    const safeUser = toSafeUser(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Server error during registration.' } });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: { message: 'Email and password are required.' } });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user (explicitly select passwordHash)
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedEmail }],
    }).select('+passwordHash');

    if (!user || !user.passwordHash) {
      // Generic security error message
      res.status(401).json({ success: false, error: { message: 'Invalid credentials. Check email/username and password.' } });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: { message: 'Invalid credentials. Check email/username and password.' } });
      return;
    }

    const token = generateToken(user._id.toString());
    const safeUser = toSafeUser(user);

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message || 'Server error during login.' } });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized.' } });
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
    res.status(500).json({ success: false, error: { message: error.message || 'Server error fetching user profile.' } });
  }
};
