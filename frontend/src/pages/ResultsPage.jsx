import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { api } from '../api/client';
import { Crown, Trophy, Medal, Users, BarChart3 } from 'lucide-react';

export default function ResultsPage() {
  const { competitionId } = useParams();
  const [results, setResults] = useState(null);
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef([]);

  useEffect(() => {
    if (competitionId) {
      loadResults();
    }
  }, [competitionId]);

  useEffect(() => {
    if (results && cardsRef.current.length > 0) {
      // Animate cards on load
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [results]);

  const loadResults = async () => {
    try {
      const [resultsRes, competitionRes] = await Promise.all([
        api.getResults(competitionId),
        api.getCompetition(competitionId),
      ]);
      setResults(resultsRes.data);
      setCompetition(competitionRes.data);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown size={24} />;
      case 2:
        return <Trophy size={24} />;
      case 3:
        return <Medal size={24} />;
      default:
        return <span style={{ fontWeight: 'bold' }}>{position}</span>;
    }
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return { bg: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)', glow: 'rgba(255, 215, 0, 0.5)' };
      case 2:
        return { bg: 'linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)', glow: 'rgba(192, 192, 192, 0.3)' };
      case 3:
        return { bg: 'linear-gradient(135deg, #cd7f32 0%, #b87333 100%)', glow: 'rgba(205, 127, 50, 0.3)' };
      default:
        return { bg: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)', glow: 'none' };
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      color: 'white',
      paddingBottom: '3rem',
    },
    header: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(0, 8, 20, 0.95)',
      backdropFilter: 'blur(10px)',
    },
    headerContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#9ca3af',
      marginBottom: '1.5rem',
    },
    stats: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#9ca3af',
    },
    statValue: {
      color: '#00d4ff',
      fontWeight: 'bold',
    },
    content: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
    },
    leaderboard: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    card: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.25rem',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      transition: 'all 0.3s',
    },
    winnerCard: {
      background: 'rgba(255, 215, 0, 0.05)',
      border: '2px solid rgba(255, 215, 0, 0.3)',
      boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
    },
    positionBadge: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000',
      flexShrink: 0,
    },
    contestantImage: {
      width: '56px',
      height: '56px',
      borderRadius: '8px',
      objectFit: 'cover',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    contestantPlaceholder: {
      width: '56px',
      height: '56px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #001d3d 0%, #003566 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#00d4ff',
      flexShrink: 0,
    },
    info: {
      flex: 1,
      minWidth: 0,
    },
    name: {
      fontWeight: 'bold',
      fontSize: '1.125rem',
      marginBottom: '0.25rem',
    },
    description: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      marginBottom: '0.5rem',
    },
    progressBar: {
      height: '6px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      borderRadius: '3px',
      transition: 'width 1s ease-out',
    },
    score: {
      textAlign: 'right',
      flexShrink: 0,
    },
    points: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#00d4ff',
    },
    votes: {
      fontSize: '0.75rem',
      color: '#9ca3af',
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
    emptyState: {
      textAlign: 'center',
      padding: '4rem 1.5rem',
    },
    emptyText: {
      fontSize: '1.25rem',
      color: '#9ca3af',
      marginBottom: '2rem',
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
    backLink: {
      display: 'inline-block',
      marginTop: '2rem',
      color: '#9ca3af',
      textDecoration: 'none',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>Loading results...</div>
      </div>
    );
  }

  if (!results || !competition) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Competition not found</p>
          <Link to="/competitions" style={styles.primaryBtn}>
            View Competitions
          </Link>
        </div>
      </div>
    );
  }

  const maxPoints = results.results[0]?.totalPoints || 1;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>{competition.title} - Results</h1>
          {competition.description && (
            <p style={styles.subtitle}>{competition.description}</p>
          )}
          <div style={styles.stats}>
            <div style={styles.stat}>
              <Users size={18} />
              <span style={styles.statValue}>{results.totalVotes}</span> votes
            </div>
            <div style={styles.stat}>
              <BarChart3 size={18} />
              <span style={styles.statValue}>{results.results.length}</span> contestants
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={styles.content}>
        {results.totalVotes === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No votes have been cast yet.</p>
            <Link to={`/vote/${competitionId}`} style={styles.primaryBtn}>
              Be the First to Vote
            </Link>
          </div>
        ) : (
          <div style={styles.leaderboard}>
            {results.results.map((result, index) => {
              const positionColor = getPositionColor(result.position);
              const progressWidth = (result.totalPoints / maxPoints) * 100;

              return (
                <div
                  key={result.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  style={{
                    ...styles.card,
                    ...(result.position === 1 ? styles.winnerCard : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.positionBadge,
                      background: positionColor.bg,
                      boxShadow: positionColor.glow !== 'none' ? `0 0 20px ${positionColor.glow}` : 'none',
                    }}
                  >
                    {getPositionIcon(result.position)}
                  </div>

                  {result.imageUrl ? (
                    <img
                      src={result.imageUrl}
                      alt={result.name}
                      style={styles.contestantImage}
                    />
                  ) : (
                    <div style={styles.contestantPlaceholder}>
                      {result.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div style={styles.info}>
                    <div style={styles.name}>{result.name}</div>
                    {result.description && (
                      <div style={styles.description}>{result.description}</div>
                    )}
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${progressWidth}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div style={styles.score}>
                    <div style={styles.points}>{result.totalPoints}</div>
                    <div style={styles.votes}>points</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Link to="/competitions" style={styles.backLink}>
          ← Back to Competitions
        </Link>
      </div>
    </div>
  );
}
