import { Response, NextFunction } from 'express';
import { AuthRequest } from '../auth.js';
import { prisma } from '../db.js';

export const verifySponsorOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const userSponsorId = req.user.sponsorId;
  const campaignId = req.params.id;

  if (!userSponsorId) {
    return res.status(403).json({ error: 'User is not associated with any sponsor' });
  }

  try {
    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: String(campaignId) },
        select: { sponsorId: true },
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found.' });
      }

      if (campaign.sponsorId !== userSponsorId) {
        return res.status(403).json({ error: 'Forbidden: You do not own this campaign.' });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
