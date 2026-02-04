import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';

const router: IRouter = Router();

// GET /api/publishers - List all publishers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const publishers = await prisma.publisher.findMany({
      include: {
        _count: {
          select: { adSlots: true, placements: true },
        },
      },
      orderBy: { monthlyViews: 'desc' },
    });
    res.json(publishers);
  } catch (error) {
    console.error('Error fetching publishers:', error);
    res.status(500).json({ error: 'Failed to fetch publishers' });
  }
});

// GET /api/publishers/:id - Get single publisher with ad slots
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const publisher = await prisma.publisher.findUnique({
      where: { id },
      include: {
        adSlots: true,
        placements: {
          include: {
            campaign: { select: { name: true, sponsor: { select: { name: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!publisher) {
      res.status(404).json({ error: 'Publisher not found' });
      return;
    }

    res.json(publisher);
  } catch (error) {
    console.error('Error fetching publisher:', error);
    res.status(500).json({ error: 'Failed to fetch publisher' });
  }
});

router.get('/:id/stats', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const [adSlots, placements] = await Promise.all([
      prisma.adSlot.findMany({
        where: { publisherId: id },
      }),
      prisma.placement.findMany({
        where: {
          publisherId: id,
          status: 'ACTIVE',
        },
        select: { agreedPrice: true },
      }),
    ]);
    const activeSlots = adSlots.filter((slot) => slot.isAvailable).length;
    const totalSlots = adSlots.length;
    const avgPrice =
      totalSlots > 0
        ? adSlots.reduce((sum, slot) => sum + Number(slot.basePrice), 0) / totalSlots
        : 0;

    const totalRevenue = placements.reduce((sum, p) => sum + Number(p.agreedPrice), 0);
    res.json({
      totalRevenue: totalRevenue,
      activeSlots: activeSlots,
      avgPrice: Math.round(avgPrice),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
