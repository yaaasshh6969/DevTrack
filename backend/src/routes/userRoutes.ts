import { Router } from 'express';
import {
  getMe,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Authenticated user profile routes
router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateProfile);
router.patch('/me/password', authMiddleware, changePassword);

// Public / general user endpoints
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
