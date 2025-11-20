import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Get results for a competition
router.get('/:competitionId', async (req, res) => {
  try {
    const { competitionId } = req.params;

    // Get all vote rankings for this competition
    const voteRankings = await prisma.voteRanking.findMany({
      where: {
        vote: {
          competitionId
        }
      },
      include: {
        contestant: true
      }
    });

    // Calculate total points for each contestant
    const contestantScores = new Map<string, {
      contestant: any;
      totalPoints: number;
      voteCount: number;
      rankCounts: { [key: number]: number };
    }>();

    voteRankings.forEach((ranking) => {
      const contestantId = ranking.contestantId;

      if (!contestantScores.has(contestantId)) {
        contestantScores.set(contestantId, {
          contestant: ranking.contestant,
          totalPoints: 0,
          voteCount: 0,
          rankCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }

      const score = contestantScores.get(contestantId)!;
      score.totalPoints += ranking.points;
      score.voteCount += 1;
      score.rankCounts[ranking.rank] = (score.rankCounts[ranking.rank] || 0) + 1;
    });

    // Convert to array and sort by total points
    const results = Array.from(contestantScores.values())
      .map((score, index) => ({
        ...score.contestant,
        totalPoints: score.totalPoints,
        voteCount: score.voteCount,
        rankCounts: score.rankCounts,
        averagePoints: score.voteCount > 0 ? score.totalPoints / score.voteCount : 0
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((result, index) => ({
        ...result,
        position: index + 1
      }));

    // Get total vote count
    const totalVotes = await prisma.vote.count({
      where: { competitionId }
    });

    res.json({
      competitionId,
      totalVotes,
      results
    });
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

export default router;
