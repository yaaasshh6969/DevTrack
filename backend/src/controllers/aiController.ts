import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { generateAriaResponse } from '../services/aiService';

export const chatWithAria = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required. No token provided.' },
      });
      return;
    }

    const { message, history } = req.body;

    // Validation
    if (message === undefined || message === null || typeof message !== 'string') {
      res.status(400).json({
        success: false,
        error: { message: 'Message is required and must be a string.' },
      });
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      res.status(400).json({
        success: false,
        error: { message: 'Message cannot be empty.' },
      });
      return;
    }

    if (trimmedMessage.length > 2000) {
      res.status(400).json({
        success: false,
        error: { message: 'Message cannot exceed 2000 characters.' },
      });
      return;
    }

    // Controlled fallback if AI API Key is not configured
    if (!process.env.AI_API_KEY || !process.env.AI_API_KEY.trim()) {
      res.status(503).json({
        success: false,
        message: 'AI Coach is not configured yet.',
        error: { message: 'AI Coach is not configured yet.' },
      });
      return;
    }

    const aiMessage = await generateAriaResponse(req.userId, trimmedMessage, history);

    res.status(200).json({
      success: true,
      data: {
        message: aiMessage,
      },
    });
  } catch (error: any) {
    console.error('[AI Controller Error]:', error.message || error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to process AI chat request.',
      },
    });
  }
};
