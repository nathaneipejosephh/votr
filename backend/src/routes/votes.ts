import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../utils/prisma';

const router = express.Router();

// Borda count points for ranks 1-5
const POINTS_MAP: { [key: number]: number } = {
  1: 7,
  2: 5,
  3: 3,
  4: 2,
  5: 1
};

// Submit a vote
router.post('/', async (req, res) => {
  try {
    const { voterId, competitionId, rankings, isAnonymous, voterName, voterEmail } = req.body;

    // Validate rankings (should be array of contestantIds in order 1-5)
    if (!Array.isArray(rankings) || rankings.length !== 5) {
      return res.status(400).json({ error: 'Must rank exactly 5 contestants' });
    }

    // Check if voter has already voted in this competition
    const existingVote = await prisma.vote.findUnique({
      where: {
        voterId_competitionId: {
          voterId,
          competitionId
        }
      }
    });

    if (existingVote) {
      return res.status(409).json({ error: 'You have already voted in this competition' });
    }

    // Check if competition is active
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId }
    });

    if (!competition || !competition.isActive) {
      return res.status(400).json({ error: 'This competition is not currently accepting votes' });
    }

    // Create vote with rankings and voter identity
    const vote = await prisma.vote.create({
      data: {
        voterId,
        competitionId,
        isAnonymous: isAnonymous !== false, // Default to anonymous
        voterName: isAnonymous === false ? voterName : null,
        voterEmail: isAnonymous === false ? voterEmail : null,
        rankings: {
          create: rankings.map((contestantId: string, index: number) => ({
            contestantId,
            rank: index + 1,
            points: POINTS_MAP[index + 1]
          }))
        }
      },
      include: {
        rankings: true
      }
    });

    res.status(201).json(vote);
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Check if voter has voted
router.get('/check/:competitionId/:voterId', async (req, res) => {
  try {
    const { competitionId, voterId } = req.params;
    const vote = await prisma.vote.findUnique({
      where: {
        voterId_competitionId: {
          voterId,
          competitionId
        }
      }
    });
    res.json({ hasVoted: !!vote });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check vote status' });
  }
});

export default router;
