import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { authMiddleware, roleMiddleware } from '../auth.js';
import { verifyPublisherOwnership } from '../middleware/ownership.js';

const router: IRouter = Router();

// GET /api/ad-slots - List available ad slots
router.get('/', async (req: Request, res: Response) => {
  try {
    const { publisherId, type, available } = req.query;

    const adSlots = await prisma.adSlot.findMany({
      where: {
        ...(publisherId && { publisherId: String(publisherId) }),
        ...(type && {
          type: type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST',
        }),
        ...(available === 'true' && { isAvailable: true }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot with details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['PUBLISHER']),
  verifyPublisherOwnership,
  async (req: Request, res: Response) => {
    try {
      const { name, description, type, basePrice, publisherId, position, width, height } = req.body;

      if (!name || !type || !basePrice || !publisherId || !position) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      // input validation
      if (Number(basePrice) <= 0) {
        res.status(400).json({ error: 'basePrice must be a positive number' });
        return;
      }

      const adSlot = await prisma.adSlot.create({
        data: {
          name,
          description,
          type,
          position,
          width: width ? parseInt(width) : null,
          height: height ? parseInt(height) : null,
          basePrice: Number(basePrice),
          publisherId,
          isAvailable: true,
        },
        include: {
          publisher: { select: { id: true, name: true } },
        },
      });

      res.status(201).json(adSlot);
    } catch (error) {
      console.error('Error creating ad slot:', error);
      res.status(500).json({ error: 'Failed to create ad slot' });
    }
  }
);

// POST /api/ad-slots/:id/book - Book an ad slot (simplified booking flow)
// This marks the slot as unavailable and creates a simple booking record
router.post('/:id/book', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { sponsorId, message } = req.body;

    if (!sponsorId) {
      res.status(400).json({ error: 'sponsorId is required' });
      return;
    }

    // Check if slot exists and is available
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    // Mark slot as unavailable
    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (for testing)
router.post('/:id/unbook', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedSlot = await prisma.adSlot.update({
      where: { id: id as string },
      data: { isAvailable: true },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

//PUT /api/ad-slots/:id endpoint
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['PUBLISHER']),
  verifyPublisherOwnership,
  async (req: Request, res: Response) => {
    try {
      const id = getParam(req.params.id);
      const { name, description, type, position, width, height, basePrice, isAvailable } = req.body;

      const updatedSlot = await prisma.adSlot.update({
        where: { id },
        data: {
          ...(name && { name }),
          description: description !== undefined ? description : undefined,
          ...(type && { type }),
          position: position !== undefined ? position : undefined,
          width: width !== undefined ? (width ? Number(width) : null) : undefined,
          height: height !== undefined ? (height ? Number(height) : null) : undefined,
          ...(basePrice && { basePrice: Number(basePrice) }),
          ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        },
      });

      res.json(updatedSlot);
    } catch (error) {
      console.error('Error updating ad slot:', error);
      // Handle Prisma's "Record not found" error
      if ((error as any).code === 'P2025') {
        res.status(404).json({ error: 'Ad slot not found' });
      } else {
        res.status(500).json({ error: 'Failed to update ad slot' });
      }
    }
  }
);

//DELETE /api/ad-slots/:id endpoint
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['PUBLISHER']),
  verifyPublisherOwnership,
  async (req: Request, res: Response) => {
    try {
      const id = getParam(req.params.id);

      await prisma.adSlot.delete({
        where: { id },
      });

      res.json({ success: true, message: 'Ad slot deleted successfully' });
    } catch (error) {
      console.error('Error deleting ad slot:', error);
      if ((error as any).code === 'P2025') {
        res.status(404).json({ error: 'Ad slot not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete ad slot' });
      }
    }
  }
);

export default router;
