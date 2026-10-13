import { Router } from 'express';
import { chatWithAria } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// POST /api/ai/chat (Authenticated)
router.post('/chat', authMiddleware, chatWithAria);

export default router;
