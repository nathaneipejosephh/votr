import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { api } from '../utils/api';
import { getVoterId } from '../utils/voterStorage';
import { Competition, Contestant } from '../utils/api';
import ContestantCard from '../components/ContestantCard';
import RankedSlot from '../components/RankedSlot';

export default function VotePage() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [availableContestants, setAvailableContestants] = useState<Contestant[]>([]);
  const [rankedContestants, setRankedContestants] = useState<(Contestant | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const voterId = getVoterId();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (competitionId) {
      loadCompetitionData();
      checkVoteStatus();
    }
  }, [competitionId]);

  const loadCompetitionData = async () => {
    if (!competitionId) return;

    try {
      const { data } = await api.getCompetition(competitionId);
      setCompetition(data);
      setAvailableContestants(data.contestants);
    } catch (error) {
      console.error('Failed to load competition:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    if (!competitionId) return;

    try {
      const { data } = await api.checkVote(competitionId, voterId);
      setHasVoted(data.hasVoted);
    } catch (error) {
      console.error('Failed to check vote status:', error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContestant = availableContestants.find((c) => c.id === active.id) ||
      rankedContestants.find((c) => c?.id === active.id);

    if (!activeContestant) return;

    // Dropping into a ranked slot
    if (over.id.toString().startsWith('slot-')) {
      const slotIndex = parseInt(over.id.toString().replace('slot-', ''));
      const newRanked = [...rankedContestants];

      // Remove from previous slot if it was there
      const prevIndex = newRanked.findIndex((c) => c?.id === activeContestant.id);
      if (prevIndex !== -1) {
        newRanked[prevIndex] = null;
      }

      // Remove from available
      setAvailableContestants((prev) => prev.filter((c) => c.id !== activeContestant.id));

      // Add to new slot, moving existing to available if needed
      if (newRanked[slotIndex]) {
        setAvailableContestants((prev) => [...prev, newRanked[slotIndex]!]);
      }
      newRanked[slotIndex] = activeContestant;

      setRankedContestants(newRanked);
    }
    // Dropping back to available
    else if (over.id === 'available') {
      const prevIndex = rankedContestants.findIndex((c) => c?.id === activeContestant.id);
      if (prevIndex !== -1) {
        const newRanked = [...rankedContestants];
        newRanked[prevIndex] = null;
        setRankedContestants(newRanked);
        setAvailableContestants((prev) => [...prev, activeContestant]);
      }
    }
  };

  const handleSubmitVote = async () => {
    if (!competitionId) return;

    // Check if all 5 slots are filled
    if (rankedContestants.some((c) => c === null)) {
      alert('Please rank all 5 contestants before submitting!');
      return;
    }

    setSubmitting(true);

    try {
      const rankings = rankedContestants.map((c) => c!.id);
      await api.submitVote({
        voterId,
        competitionId,
        rankings,
      });

      setHasVoted(true);
      setTimeout(() => {
        navigate(`/results/${competitionId}`);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to submit vote:', error);
      if (error.response?.status === 409) {
        alert('You have already voted in this competition!');
        setHasVoted(true);
      } else {
        alert('Failed to submit vote. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const activeContestant = activeId
    ? availableContestants.find((c) => c.id === activeId) ||
      rankedContestants.find((c) => c?.id === activeId)
    : null;

  const rankLabels = ['1st Place', '2nd Place', '3rd Place', '4th Place', '5th Place'];
  const rankPoints = [7, 5, 3, 2, 1];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-8">Competition not found</p>
          <Link to="/competitions" className="px-8 py-4 bg-neon-blue text-black rounded-full font-semibold">
            View Competitions
          </Link>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-5xl font-display font-bold mb-4 text-gradient">Vote Submitted!</h1>
          <p className="text-xl text-gray-400 mb-8">Thank you for participating in {competition.title}</p>
          <div className="flex gap-4 justify-center">
            <Link
              to={`/results/${competitionId}`}
              className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full font-semibold hover:scale-105 transition-transform"
            >
              View Results
            </Link>
            <Link
              to="/competitions"
              className="px-8 py-4 border border-neon-orange text-neon-orange rounded-full font-semibold hover:bg-neon-orange hover:text-black transition-all"
            >
              Other Competitions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (competition.contestants.length < 5) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-2xl px-6">
          <p className="text-2xl text-gray-400 mb-8">
            This competition needs at least 5 contestants to enable voting.
          </p>
          <Link to="/competitions" className="px-8 py-4 bg-neon-blue text-black rounded-full font-semibold">
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-12">
      {/* Header */}
      <div className="border-b border-gray-900 sticky top-0 bg-black z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient">{competition.title}</h1>
              {competition.description && <p className="text-gray-400 mt-2">{competition.description}</p>}
            </div>
            <Link
              to="/competitions"
              className="px-6 py-3 border border-gray-700 text-gray-400 rounded-full hover:border-neon-blue hover:text-neon-blue transition-all"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Ranked Slots */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 glow-blue">Your Top 5</h2>
              <p className="text-gray-400 mb-8">Drag contestants into ranked positions. 1st gets the most points!</p>

              <SortableContext items={rankedContestants.map((_, i) => `slot-${i}`)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {rankedContestants.map((contestant, index) => (
                    <RankedSlot
                      key={index}
                      id={`slot-${index}`}
                      rank={index + 1}
                      label={rankLabels[index]}
                      points={rankPoints[index]}
                      contestant={contestant}
                    />
                  ))}
                </div>
              </SortableContext>

              {/* Submit Button */}
              <button
                onClick={handleSubmitVote}
                disabled={submitting || rankedContestants.some((c) => c === null)}
                className="w-full mt-8 px-8 py-5 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-orange rounded-xl font-bold text-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 card-glow"
              >
                {submitting ? 'Submitting...' : 'Submit Vote'}
              </button>
            </div>

            {/* Available Contestants */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 glow-pink">Available Contestants</h2>
              <p className="text-gray-400 mb-8">Choose your top 5 from the options below</p>

              <SortableContext items={availableContestants.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div id="available" className="space-y-4 min-h-96">
                  {availableContestants.map((contestant) => (
                    <ContestantCard key={contestant.id} contestant={contestant} />
                  ))}
                  {availableContestants.length === 0 && (
                    <div className="text-center py-12 text-gray-500">All contestants ranked!</div>
                  )}
                </div>
              </SortableContext>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeContestant ? <ContestantCard contestant={activeContestant} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
