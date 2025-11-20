import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Users, Vote, BarChart3, Calendar } from 'lucide-react';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      const { data } = await api.getCompetitions();
      // Filter to only show published and active competitions
      const activeCompetitions = data.filter(c => c.isActive && c.isPublished);
      setCompetitions(activeCompetitions);
    } catch (error) {
      console.error('Failed to load competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      color: 'white',
    },
    header: {
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(0, 8, 20, 0.95)',
      backdropFilter: 'blur(10px)',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
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
    homeLink: {
      padding: '0.75rem 1.5rem',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '9999px',
      color: '#9ca3af',
      background: 'transparent',
      textDecoration: 'none',
      transition: 'all 0.3s',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 1.5rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      transition: 'all 0.3s',
      cursor: 'pointer',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: 'white',
    },
    cardDesc: {
      fontSize: '0.875rem',
      color: '#9ca3af',
      marginBottom: '1rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    cardStats: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    statValue: {
      color: '#00d4ff',
      fontWeight: '600',
    },
    cardActions: {
      display: 'flex',
      gap: '0.75rem',
    },
    voteBtn: {
      flex: 1,
      padding: '0.75rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
      display: 'block',
    },
    resultsBtn: {
      flex: 1,
      padding: '0.75rem',
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '8px',
      color: '#9ca3af',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
      display: 'block',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 1.5rem',
    },
    emptyText: {
      fontSize: '1.25rem',
      color: '#9ca3af',
      marginBottom: '1rem',
    },
    emptySubtext: {
      color: '#6b7280',
      marginBottom: '2rem',
    },
    joinLink: {
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
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>Loading competitions...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Active Competitions</h1>
          <Link to="/" style={styles.homeLink}>
            ← Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {competitions.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No active competitions at the moment</p>
            <p style={styles.emptySubtext}>Have an access code? Join a competition directly!</p>
            <Link to="/join" style={styles.joinLink}>
              Enter Access Code
            </Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {competitions.map((competition) => (
              <div key={competition.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{competition.title}</h3>
                {competition.description && (
                  <p style={styles.cardDesc}>{competition.description}</p>
                )}
                <div style={styles.cardStats}>
                  <div style={styles.stat}>
                    <Users size={16} />
                    <span style={styles.statValue}>{competition.contestants?.length || 0}</span>
                    contestants
                  </div>
                  <div style={styles.stat}>
                    <Vote size={16} />
                    <span style={styles.statValue}>{competition._count?.votes || 0}</span>
                    votes
                  </div>
                </div>
                <div style={styles.cardActions}>
                  <Link to={`/vote/${competition.id}`} style={styles.voteBtn}>
                    Vote Now
                  </Link>
                  <Link to={`/results/${competition.id}`} style={styles.resultsBtn}>
                    Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
