import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function AdminPage() {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Competition form
  const [compTitle, setCompTitle] = useState('');
  const [compDescription, setCompDescription] = useState('');

  // Contestant form
  const [contName, setContName] = useState('');
  const [contDescription, setContDescription] = useState('');
  const [contImageUrl, setContImageUrl] = useState('');

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      loadContestants(selectedCompetition);
    }
  }, [selectedCompetition]);

  const loadCompetitions = async () => {
    try {
      const { data } = await api.getCompetitions();
      setCompetitions(data);
    } catch (error) {
      console.error('Failed to load competitions:', error);
    }
  };

  const loadContestants = async (competitionId) => {
    try {
      const { data } = await api.getContestants(competitionId);
      setContestants(data);
    } catch (error) {
      console.error('Failed to load contestants:', error);
    }
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    if (!compTitle.trim()) return;

    setLoading(true);
    try {
      await api.createCompetition({
        title: compTitle,
        description: compDescription,
      });
      setCompTitle('');
      setCompDescription('');
      await loadCompetitions();
      alert('Competition created!');
    } catch (error) {
      console.error('Failed to create competition:', error);
      alert('Failed to create competition');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContestant = async (e) => {
    e.preventDefault();
    if (!contName.trim() || !selectedCompetition) return;

    setLoading(true);
    try {
      await api.createContestant({
        name: contName,
        description: contDescription,
        imageUrl: contImageUrl,
        competitionId: selectedCompetition,
      });
      setContName('');
      setContDescription('');
      setContImageUrl('');
      await loadContestants(selectedCompetition);
      alert('Contestant added!');
    } catch (error) {
      console.error('Failed to create contestant:', error);
      alert('Failed to add contestant');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContestant = async (id) => {
    if (!confirm('Are you sure you want to delete this contestant?')) return;

    try {
      await api.deleteContestant(id);
      if (selectedCompetition) {
        await loadContestants(selectedCompetition);
      }
      alert('Contestant deleted');
    } catch (error) {
      console.error('Failed to delete contestant:', error);
      alert('Failed to delete contestant');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #00f0ff, #ff00ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
    },
    card: {
      background: 'linear-gradient(to bottom, #1a1a1a, #000)',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid #333',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#00f0ff',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#999',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: '#000',
      border: '1px solid #444',
      borderRadius: '0.5rem',
      color: '#fff',
      fontSize: '1rem',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: '#000',
      border: '1px solid #444',
      borderRadius: '0.5rem',
      color: '#fff',
      fontSize: '1rem',
      minHeight: '6rem',
      resize: 'vertical',
    },
    button: {
      width: '100%',
      padding: '1rem',
      background: 'linear-gradient(to right, #00f0ff, #ff00ff)',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#fff',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    list: {
      marginTop: '1.5rem',
      maxHeight: '24rem',
      overflowY: 'auto',
    },
    listItem: {
      padding: '1rem',
      background: '#000',
      border: '1px solid #444',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
      cursor: 'pointer',
    },
    selectedItem: {
      border: '1px solid #00f0ff',
      background: 'rgba(0, 240, 255, 0.1)',
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      background: 'transparent',
      border: '1px solid #ff4444',
      color: '#ff4444',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <Link to="/" style={{ color: '#00f0ff', textDecoration: 'none', fontSize: '1.1rem' }}>
          ← Back to Home
        </Link>
      </div>

      <div style={styles.grid}>
        {/* Create Competition */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create Competition</h2>
          <form onSubmit={handleCreateCompetition} style={styles.form}>
            <div>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={compTitle}
                onChange={(e) => setCompTitle(e.target.value)}
                style={styles.input}
                placeholder="e.g., Ultimate Chili Cook-Off 2025"
                required
              />
            </div>
            <div>
              <label style={styles.label}>Description</label>
              <textarea
                value={compDescription}
                onChange={(e) => setCompDescription(e.target.value)}
                style={styles.textarea}
                placeholder="Describe the competition..."
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Creating...' : 'Create Competition'}
            </button>
          </form>

          <div style={styles.list}>
            <h3 style={{ ...styles.label, fontSize: '1rem', marginBottom: '1rem' }}>
              Active Competitions ({competitions.length})
            </h3>
            {competitions.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setSelectedCompetition(comp.id)}
                style={{
                  ...styles.listItem,
                  ...(selectedCompetition === comp.id ? styles.selectedItem : {}),
                }}
              >
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{comp.title}</h4>
                {comp.description && (
                  <p style={{ fontSize: '0.875rem', color: '#999' }}>{comp.description}</p>
                )}
                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                  {comp.contestants?.length || 0} contestants
                </p>
              </div>
            ))}
            {competitions.length === 0 && (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                No competitions yet
              </p>
            )}
          </div>
        </div>

        {/* Add Contestants */}
        <div style={styles.card}>
          <h2 style={{...styles.cardTitle, color: '#ff00ff'}}>Add Contestants</h2>

          {!selectedCompetition ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '3rem' }}>
              ← Select a competition to add contestants
            </p>
          ) : (
            <>
              <form onSubmit={handleCreateContestant} style={styles.form}>
                <div>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={contName}
                    onChange={(e) => setContName(e.target.value)}
                    style={styles.input}
                    placeholder="e.g., Spicy Steve's Chili"
                    required
                  />
                </div>
                <div>
                  <label style={styles.label}>Description</label>
                  <textarea
                    value={contDescription}
                    onChange={(e) => setContDescription(e.target.value)}
                    style={{...styles.textarea, minHeight: '4rem'}}
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label style={styles.label}>Image URL (optional)</label>
                  <input
                    type="url"
                    value={contImageUrl}
                    onChange={(e) => setContImageUrl(e.target.value)}
                    style={styles.input}
                    placeholder="https://..."
                  />
                </div>
                <button type="submit" disabled={loading} style={{...styles.button, background: 'linear-gradient(to right, #ff00ff, #ff6b00)'}}>
                  {loading ? 'Adding...' : 'Add Contestant'}
                </button>
              </form>

              <div style={styles.list}>
                <h3 style={{ ...styles.label, fontSize: '1rem', marginBottom: '1rem' }}>
                  Contestants ({contestants.length})
                </h3>
                {contestants.map((contestant) => (
                  <div key={contestant.id} style={{ ...styles.listItem, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{contestant.name}</h4>
                      {contestant.description && (
                        <p style={{ fontSize: '0.875rem', color: '#999' }}>{contestant.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteContestant(contestant.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {contestants.length === 0 && (
                  <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                    No contestants yet
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to="/competitions"
          style={{
            padding: '1rem 2rem',
            background: '#00f0ff',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '50px',
            fontWeight: '600',
          }}
        >
          View All Competitions
        </Link>
        {selectedCompetition && contestants.length >= 5 && (
          <Link
            to={`/vote/${selectedCompetition}`}
            style={{
              padding: '1rem 2rem',
              border: '2px solid #ff6b00',
              color: '#ff6b00',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
            }}
          >
            Test Voting
          </Link>
        )}
      </div>
    </div>
  );
}
