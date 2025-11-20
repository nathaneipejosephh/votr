import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Get contestants for a competition
router.get('/competition/:competitionId', async (req, res) => {
  try {
    const contestants = await prisma.contestant.findMany({
      where: { competitionId: req.params.competitionId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(contestants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contestants' });
  }
});

// Create contestant
router.post('/', async (req, res) => {
  try {
    const { name, description, imageUrl, competitionId } = req.body;
    const contestant = await prisma.contestant.create({
      data: { name, description, imageUrl, competitionId }
    });
    res.status(201).json(contestant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contestant' });
  }
});

// Update contestant
router.put('/:id', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const contestant = await prisma.contestant.update({
      where: { id: req.params.id },
      data: { name, description, imageUrl }
    });
    res.json(contestant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contestant' });
  }
});

// Delete contestant
router.delete('/:id', async (req, res) => {
  try {
    await prisma.contestant.delete({
      where: { id: req.params.id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contestant' });
  }
});

export default router;
