import { Response, NextFunction } from 'express';
import { AuthRequest } from '../auth.js';

export const verifySponsorOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.error('verifySponsorOwnership: No user found on request object');
    return res.status(401).json({ error: 'Authentication required' });
  }

  const userSponsorId = req.user.sponsorId;

  if (!userSponsorId) {
    return res.status(403).json({ error: 'User is not associated with any sponsor' });
  }

  next();
};
