import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

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

export default router;
