import { Response, NextFunction } from 'express';
import { AuthRequest } from '../auth.js';

export const verifySponsorOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const sponsorId = req.body.sponsorId || req.params.sponsorId;

  // Check if the user is a Sponsor and matches the ID provided in the request
  if (!user || user.role !== 'SPONSOR' || (sponsorId && user.sponsorId !== sponsorId)) {
    return res.status(403).json({
      error: 'Forbidden: You do not have permission to manage this sponsor profile',
    });
  }

  next();
};
