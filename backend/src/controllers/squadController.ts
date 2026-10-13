import { Request, Response } from 'express';

export const getSquads = (_req: Request, res: Response): void => {
  res.status(200).json({ success: true, message: 'GET /api/squads endpoint stub' });
};
