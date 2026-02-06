import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';
import { authMiddleware, roleMiddleware, type AuthRequest } from '../auth.js';
import { verifySponsorOwnership } from '../middleware/sponsorOwnership.js';

const router: IRouter = Router();

// GET /api/campaigns - List all campaigns
router.get('/', authMiddleware, verifySponsorOwnership, async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, maxPrice } = req.query;
    const sponsorId = req.user?.sponsorId;

    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(status && { status: status as string as 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
        ...(sponsorId && { sponsorId: String(sponsorId) }),
        ...(search && {
          name: { contains: String(search), mode: 'insensitive' },
        }),
        ...(maxPrice && {
          budget: { lte: Number(maxPrice) },
        }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaigns/:id - Get single campaign with details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST /api/campaigns - Create new campaign
router.post(
  '/',
  authMiddleware,
  verifySponsorOwnership,
  roleMiddleware(['SPONSOR']),
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate,
        endDate,
        targetCategories,
        targetRegions,
        sponsorId,
      } = req.body;

      if (!name || !budget || !startDate || !endDate || !sponsorId) {
        res.status(400).json({
          error: 'Name, budget, startDate, endDate, and sponsorId are required',
        });
        return;
      }

      const campaign = await prisma.campaign.create({
        data: {
          name,
          description,
          budget: Number(budget),
          cpmRate: cpmRate ? Number(cpmRate) : null,
          cpcRate: cpcRate ? Number(cpcRate) : null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          targetCategories: targetCategories || [],
          targetRegions: targetRegions || [],
          sponsorId,
        },
        include: {
          sponsor: { select: { id: true, name: true } },
        },
      });

      res.status(201).json(campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  }
);

// TODO: Add PUT /api/campaigns/:id endpoint
// Update campaign details (name, budget, dates, status, etc.)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['SPONSOR']),
  verifySponsorOwnership,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = getParam(req.params.id);
      const { name, description, budget, status, startDate, endDate } = req.body;

      const userSponsorId = req.user?.sponsorId;

      // First, verify the campaign belongs to this user
      const existingCampaign = await prisma.campaign.findUnique({
        where: { id },
        select: { sponsorId: true },
      });

      if (!existingCampaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      if (existingCampaign.sponsorId !== req.user?.sponsorId) {
        return res.status(403).json({ error: 'Unauthorized to edit this campaign' });
      }

      const updatedCampaign = await prisma.campaign.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(budget && { budget: Number(budget) }),
          ...(status && { status }),
          ...(startDate && { startDate: new Date(startDate) }),
          ...(endDate && { endDate: new Date(endDate) }),
        },
      });

      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update campaign' });
    }
  }
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['SPONSOR']),
  verifySponsorOwnership,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = getParam(req.params.id);
      const userSponsorId = req.user?.sponsorId;

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        select: { sponsorId: true }, //
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' }); //
      }

      if (campaign.sponsorId !== userSponsorId) {
        return res.status(403).json({ error: 'Unauthorized to delete this campaign' }); //
      }

      await prisma.campaign.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Delete Error:', error);
      res.status(500).json({ error: 'Failed to delete campaign' }); //
    }
  }
);

export default router;
