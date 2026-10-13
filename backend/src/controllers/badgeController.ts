import { Request, Response } from 'express';

export const getBadgesStub = (_req: Request, res: Response): void => {
  res.status(410).json({ success: false, error: { message: 'Use GET /api/badges (authenticated).' } });
};
