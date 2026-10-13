import { Router } from 'express';
import { getBadges } from '../controllers/gamificationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getBadges);

export default router;
