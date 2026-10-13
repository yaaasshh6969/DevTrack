import { Router } from 'express';
import {
  getDailyLogs,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
  getStats,
} from '../controllers/logController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

// Stats must come before /:id to avoid route conflict
router.get('/stats', getStats);

router.get('/', getDailyLogs);
router.post('/', createDailyLog);
router.patch('/:id', updateDailyLog);
router.delete('/:id', deleteDailyLog);

export default router;
