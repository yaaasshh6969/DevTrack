import { Router } from 'express';
import { getGamification } from '../controllers/gamificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getGamification);

export default router;
