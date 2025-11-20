import express from 'express';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../utils/prisma';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Generate a 6-digit access code
const generateAccessCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get all competitions
router.get('/', async (req, res) => {
  try {
    const competitions = await prisma.competition.findMany({
      include: {
        contestants: true,
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competitions' });
  }
});

// Get single competition
router.get('/:id', async (req, res) => {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id: req.params.id },
      include: {
        contestants: true,
        _count: {
          select: { votes: true }
        }
      }
    });
    if (!competition) {
      return res.status(404).json({ error: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competition' });
  }
});

// Create competition
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const competition = await prisma.competition.create({
      data: { title, description }
    });
    res.status(201).json(competition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create competition' });
  }
});

// Update competition
router.put('/:id', async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const competition = await prisma.competition.update({
      where: { id: req.params.id },
      data: { title, description, isActive }
    });
    res.json(competition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update competition' });
  }
});

// Delete competition
router.delete('/:id', async (req, res) => {
  try {
    await prisma.competition.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete competition' });
  }
});

// Publish competition - generate access code and QR code
router.post('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if competition exists
    const existing = await prisma.competition.findUnique({
      where: { id },
      include: { contestants: true }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Competition not found' });
    }

    // Require at least 5 contestants to publish
    if (existing.contestants.length < 5) {
      return res.status(400).json({
        error: 'Competition needs at least 5 contestants to publish'
      });
    }

    // Generate unique access code
    let accessCode = generateAccessCode();
    let attempts = 0;
    while (attempts < 10) {
      const existingCode = await prisma.competition.findUnique({
        where: { accessCode }
      });
      if (!existingCode) break;
      accessCode = generateAccessCode();
      attempts++;
    }

    // Update competition with access code and publish status
    const competition = await prisma.competition.update({
      where: { id },
      data: {
        accessCode,
        isPublished: true,
        isActive: true
      }
    });

    // Generate QR code URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const voteUrl = `${frontendUrl}/vote/${id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(voteUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    res.json({
      competition,
      accessCode,
      qrCodeDataUrl,
      voteUrl
    });
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: 'Failed to publish competition' });
  }
});

// Get competition by access code
router.get('/code/:accessCode', async (req, res) => {
  try {
    const competition = await prisma.competition.findUnique({
      where: { accessCode: req.params.accessCode },
      include: {
        contestants: true,
        _count: {
          select: { votes: true }
        }
      }
    });

    if (!competition) {
      return res.status(404).json({ error: 'Invalid access code' });
    }

    if (!competition.isActive) {
      return res.status(400).json({ error: 'This competition is no longer active' });
    }

    res.json(competition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch competition' });
  }
});

// Unpublish competition
router.post('/:id/unpublish', async (req, res) => {
  try {
    const competition = await prisma.competition.update({
      where: { id: req.params.id },
      data: {
        isPublished: false,
        isActive: false
      }
    });
    res.json(competition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unpublish competition' });
  }
});

export default router;
