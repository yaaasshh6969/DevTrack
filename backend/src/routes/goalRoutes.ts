import { Router } from 'express';
import { getGoals } from '../controllers/gamificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getGoals);

export default router;
