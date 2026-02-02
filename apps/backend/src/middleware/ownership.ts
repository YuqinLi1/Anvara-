import { Response, NextFunction } from 'express';
import { AuthRequest } from '../auth.js';

export const verifyPublisherOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const publisherId = req.body.publisherId || req.params.publisherId;

  // If the user isn't a publisher or doesn't own the ID in the request, block them
  if (!user || !user.publisherId || user.publisherId !== publisherId) {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to manage this publisher profile',
    });
  }

  next();
};
