import { Router } from 'express';
import { getSquads } from '../controllers/squadController';

const router = Router();

router.get('/', getSquads);

export default router;
