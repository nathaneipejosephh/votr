import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { api, getVoterId } from '../api/client';
import ContestantCard from '../components/ContestantCard';
import RankedSlot from '../components/RankedSlot';

export default function VotePage() {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [availableContestants, setAvailableContestants] = useState([]);
  const [rankedContestants, setRankedContestants] = useState([null, null, null, null, null]);
  const [activeId, setActiveId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Voter identity state
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [identityType, setIdentityType] = useState('anonymous'); // 'anonymous', 'name', 'google'
  const [voterName, setVoterName] = useState('');

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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
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
        setAvailableContestants((prev) => [...prev, newRanked[slotIndex]]);
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

  const handlePrepareSubmit = () => {
    // Check if all 5 slots are filled
    if (rankedContestants.some((c) => c === null)) {
      alert('Please rank all 5 contestants before submitting!');
      return;
    }
    setShowIdentityModal(true);
  };

  const handleSubmitVote = async () => {
    if (!competitionId) return;

    setSubmitting(true);
    setShowIdentityModal(false);

    try {
      const rankings = rankedContestants.map((c) => c.id);
      await api.submitVote({
        voterId,
        competitionId,
        rankings,
        isAnonymous: identityType === 'anonymous',
        voterName: identityType === 'name' ? voterName : null,
        voterEmail: null, // Would be set from Google OAuth
      });

      setHasVoted(true);
      setTimeout(() => {
        navigate(`/results/${competitionId}`);
      }, 1500);
    } catch (error) {
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

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      color: 'white',
      paddingBottom: '3rem',
    },
    header: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'sticky',
      top: 0,
      background: 'rgba(0, 8, 20, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 10,
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    description: {
      color: '#9ca3af',
      marginTop: '0.5rem',
    },
    backBtn: {
      padding: '0.75rem 1.5rem',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '9999px',
      color: '#9ca3af',
      background: 'transparent',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textDecoration: 'none',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 1.5rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '3rem',
    },
    sectionTitle: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#00d4ff',
    },
    sectionDesc: {
      color: '#9ca3af',
      marginBottom: '2rem',
    },
    submitBtn: {
      width: '100%',
      marginTop: '2rem',
      padding: '1.25rem 2rem',
      background: 'linear-gradient(90deg, #ff006e, #00d4ff, #ff9500)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.125rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    submitBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    availableContainer: {
      minHeight: '24rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#6b7280',
    },
    loadingPage: {
      minHeight: '100vh',
      background: '#000814',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: '1.5rem',
      color: '#9ca3af',
    },
    successPage: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    successContent: {
      textAlign: 'center',
      maxWidth: '600px',
      padding: '0 1.5rem',
    },
    successIcon: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
      color: '#00d4ff',
    },
    successTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    successMsg: {
      fontSize: '1.25rem',
      color: '#9ca3af',
      marginBottom: '2rem',
    },
    btnGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryBtn: {
      padding: '1rem 2rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      border: 'none',
      borderRadius: '9999px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    secondaryBtn: {
      padding: '1rem 2rem',
      background: 'transparent',
      border: '1px solid #ff9500',
      borderRadius: '9999px',
      color: '#ff9500',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
    },
    // Identity Modal Styles
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    },
    modal: {
      background: 'linear-gradient(135deg, #001d3d 0%, #000814 100%)',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '500px',
      width: '100%',
      border: '1px solid rgba(0, 212, 255, 0.3)',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#00d4ff',
    },
    modalDesc: {
      color: '#9ca3af',
      marginBottom: '1.5rem',
    },
    optionBtn: {
      width: '100%',
      padding: '1rem',
      marginBottom: '0.75rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid transparent',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.3s',
    },
    optionBtnActive: {
      borderColor: '#00d4ff',
      background: 'rgba(0, 212, 255, 0.1)',
    },
    optionTitle: {
      fontWeight: 'bold',
      marginBottom: '0.25rem',
    },
    optionDesc: {
      fontSize: '0.875rem',
      color: '#9ca3af',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    modalBtnGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem',
    },
    cancelBtn: {
      flex: 1,
      padding: '0.75rem',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: '#9ca3af',
      cursor: 'pointer',
    },
    confirmBtn: {
      flex: 1,
      padding: '0.75rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successContent}>
          <p style={styles.successMsg}>Competition not found</p>
          <Link to="/competitions" style={styles.primaryBtn}>
            View Competitions
          </Link>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successContent}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>Vote Submitted!</h1>
          <p style={styles.successMsg}>Thank you for participating in {competition.title}</p>
          <div style={styles.btnGroup}>
            <Link to={`/results/${competitionId}`} style={styles.primaryBtn}>
              View Results
            </Link>
            <Link to="/competitions" style={styles.secondaryBtn}>
              Other Competitions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (competition.contestants.length < 5) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successContent}>
          <p style={styles.successMsg}>
            This competition needs at least 5 contestants to enable voting.
          </p>
          <Link to="/competitions" style={styles.primaryBtn}>
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>{competition.title}</h1>
            {competition.description && <p style={styles.description}>{competition.description}</p>}
          </div>
          <Link to="/competitions" style={styles.backBtn}>
            ← Back
          </Link>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={styles.content}>
          <div style={styles.grid}>
            {/* Ranked Slots */}
            <div>
              <h2 style={styles.sectionTitle}>Your Top 5</h2>
              <p style={styles.sectionDesc}>Drag contestants into ranked positions. 1st gets the most points!</p>

              <SortableContext items={rankedContestants.map((_, i) => `slot-${i}`)} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                onClick={handlePrepareSubmit}
                disabled={submitting || rankedContestants.some((c) => c === null)}
                style={{
                  ...styles.submitBtn,
                  ...(submitting || rankedContestants.some((c) => c === null) ? styles.submitBtnDisabled : {}),
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Vote'}
              </button>
            </div>

            {/* Available Contestants */}
            <div>
              <h2 style={{ ...styles.sectionTitle, color: '#ff006e' }}>Available Contestants</h2>
              <p style={styles.sectionDesc}>Choose your top 5 from the options below</p>

              <SortableContext items={availableContestants.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div id="available" style={styles.availableContainer}>
                  {availableContestants.map((contestant) => (
                    <ContestantCard key={contestant.id} contestant={contestant} />
                  ))}
                  {availableContestants.length === 0 && (
                    <div style={styles.emptyState}>All contestants ranked!</div>
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

      {/* Identity Modal */}
      {showIdentityModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>How would you like to vote?</h3>
            <p style={styles.modalDesc}>Choose how your vote will be recorded</p>

            <button
              style={{
                ...styles.optionBtn,
                ...(identityType === 'anonymous' ? styles.optionBtnActive : {}),
              }}
              onClick={() => setIdentityType('anonymous')}
            >
              <div style={styles.optionTitle}>Vote Anonymously</div>
              <div style={styles.optionDesc}>Your vote will be recorded without any identifying information</div>
            </button>

            <button
              style={{
                ...styles.optionBtn,
                ...(identityType === 'name' ? styles.optionBtnActive : {}),
              }}
              onClick={() => setIdentityType('name')}
            >
              <div style={styles.optionTitle}>Provide Your Name</div>
              <div style={styles.optionDesc}>Your name will be visible to the competition organizer</div>
            </button>

            {identityType === 'name' && (
              <input
                type="text"
                placeholder="Enter your name"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                style={styles.input}
              />
            )}

            <div style={styles.modalBtnGroup}>
              <button style={styles.cancelBtn} onClick={() => setShowIdentityModal(false)}>
                Cancel
              </button>
              <button
                style={styles.confirmBtn}
                onClick={handleSubmitVote}
                disabled={identityType === 'name' && !voterName.trim()}
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
