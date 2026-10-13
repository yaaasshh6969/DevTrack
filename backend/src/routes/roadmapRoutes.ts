import { Router } from 'express';
import { getRoadmaps, patchTopic } from '../controllers/roadmapController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getRoadmaps);
router.patch('/topics/:topicId', patchTopic);

export default router;
