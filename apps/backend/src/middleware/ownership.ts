import { Response, NextFunction } from 'express';
import { AuthRequest } from '../auth.js';
import { prisma } from '../db.js';

export const verifyPublisherOwnership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.error('Ownership Check Failed: req.user is undefined. Check authMiddleware.');
    return res.status(401).json({ error: 'Authentication failed. Please log in again.' });
  }

  const userPublisherId = req.user.publisherId;

  if (!userPublisherId) {
    return res.status(403).json({ error: 'User is not associated with any publisher profile.' });
  }

  const slotId = req.params.id;

  try {
    if (slotId) {
      const adSlot = await prisma.adSlot.findUnique({
        where: { id: String(slotId) },
        select: { publisherId: true },
      });

      if (!adSlot) {
        return res.status(404).json({ error: 'Ad slot not found.' });
      }

      if (adSlot.publisherId !== userPublisherId) {
        return res.status(403).json({ error: 'You do not have permission to modify this slot.' });
      }
    }

    next();
  } catch (error) {
    console.error('Database error during ownership verification:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
