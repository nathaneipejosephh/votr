import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Share2,
  QrCode,
  Copy,
  Link as LinkIcon,
  Check,
  X,
  Users,
  Vote,
  BarChart3,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading, login, logout, isAuthenticated } = useAuth();

  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedCompetitionData, setSelectedCompetitionData] = useState(null);
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Competition form
  const [compTitle, setCompTitle] = useState('');
  const [compDescription, setCompDescription] = useState('');

  // Contestant form
  const [contName, setContName] = useState('');
  const [contDescription, setContDescription] = useState('');
  const [contImageUrl, setContImageUrl] = useState('');

  // Modals
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishData, setPublishData] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Edit mode
  const [editingCompetition, setEditingCompetition] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      loadContestants(selectedCompetition);
      const compData = competitions.find(c => c.id === selectedCompetition);
      setSelectedCompetitionData(compData);
    }
  }, [selectedCompetition, competitions]);

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
    } catch (error) {
      console.error('Failed to create competition:', error);
      alert('Failed to create competition');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompetition = async () => {
    if (!editingCompetition || !editTitle.trim()) return;

    setLoading(true);
    try {
      await api.updateCompetition(editingCompetition, {
        title: editTitle,
        description: editDescription,
      });
      setEditingCompetition(null);
      await loadCompetitions();
    } catch (error) {
      console.error('Failed to update competition:', error);
      alert('Failed to update competition');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompetition = async (id) => {
    if (!confirm('Are you sure you want to delete this competition? This will delete all contestants and votes.')) return;

    try {
      await api.deleteCompetition(id);
      if (selectedCompetition === id) {
        setSelectedCompetition(null);
        setContestants([]);
      }
      await loadCompetitions();
    } catch (error) {
      console.error('Failed to delete competition:', error);
      alert('Failed to delete competition');
    }
  };

  const handlePublishCompetition = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.publishCompetition(id);
      setPublishData(data);
      setShowPublishModal(true);
      await loadCompetitions();
    } catch (error) {
      console.error('Failed to publish competition:', error);
      alert(error.response?.data?.error || 'Failed to publish competition');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentState) => {
    try {
      await api.updateCompetition(id, { isActive: !currentState });
      await loadCompetitions();
    } catch (error) {
      console.error('Failed to toggle competition:', error);
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
      await loadCompetitions();
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
        await loadCompetitions();
      }
    } catch (error) {
      console.error('Failed to delete contestant:', error);
      alert('Failed to delete contestant');
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `votr-${publishData?.accessCode || 'qrcode'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const startEdit = (comp) => {
    setEditingCompetition(comp.id);
    setEditTitle(comp.title);
    setEditDescription(comp.description || '');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      color: '#fff',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '9999px',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
    },
    authBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: 'linear-gradient(90deg, #4285f4, #34a853)',
      border: 'none',
      borderRadius: '9999px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '9999px',
      color: '#9ca3af',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: '2rem',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#00d4ff',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    label: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: '#9ca3af',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '0.875rem',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1rem',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '0.875rem',
      minHeight: '5rem',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      padding: '0.875rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
    list: {
      marginTop: '1.5rem',
      maxHeight: '20rem',
      overflowY: 'auto',
    },
    listItem: {
      padding: '1rem',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      marginBottom: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    selectedItem: {
      border: '1px solid #00d4ff',
      background: 'rgba(0, 212, 255, 0.1)',
    },
    itemHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '0.5rem',
    },
    itemTitle: {
      fontWeight: '600',
      fontSize: '0.9375rem',
    },
    itemActions: {
      display: 'flex',
      gap: '0.5rem',
    },
    iconBtn: {
      padding: '0.375rem',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      color: '#9ca3af',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteBtn: {
      padding: '0.375rem',
      background: 'transparent',
      border: '1px solid rgba(255, 68, 68, 0.5)',
      borderRadius: '6px',
      color: '#ff4444',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    publishBtn: {
      padding: '0.375rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      border: 'none',
      borderRadius: '6px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemStats: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem',
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    badge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.625rem',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    publishedBadge: {
      background: 'rgba(0, 212, 255, 0.2)',
      color: '#00d4ff',
    },
    draftBadge: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#9ca3af',
    },
    // Modal styles
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
      borderRadius: '20px',
      padding: '2rem',
      maxWidth: '500px',
      width: '100%',
      border: '1px solid rgba(0, 212, 255, 0.3)',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#00d4ff',
    },
    modalSubtitle: {
      color: '#9ca3af',
      marginBottom: '1.5rem',
      fontSize: '0.875rem',
    },
    qrWrapper: {
      display: 'flex',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '12px',
      marginBottom: '1.5rem',
    },
    shareOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      marginBottom: '0.75rem',
    },
    shareIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    shareInfo: {
      flex: 1,
      minWidth: 0,
    },
    shareLabel: {
      fontWeight: '600',
      fontSize: '0.875rem',
      marginBottom: '0.25rem',
    },
    shareValue: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    copyBtn: {
      padding: '0.5rem',
      background: 'rgba(0, 212, 255, 0.2)',
      border: 'none',
      borderRadius: '6px',
      color: '#00d4ff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtn: {
      width: '100%',
      padding: '0.875rem',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: '#9ca3af',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    homeLink: {
      color: '#00d4ff',
      textDecoration: 'none',
      fontSize: '0.875rem',
    },
  };

  if (authLoading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.25rem', color: '#9ca3af' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel</h1>
        <div style={styles.headerRight}>
          {isAuthenticated ? (
            <>
              <div style={styles.userInfo}>
                {user.picture && <img src={user.picture} alt="" style={styles.avatar} />}
                <span style={{ fontSize: '0.875rem' }}>{user.name}</span>
              </div>
              <button onClick={logout} style={styles.logoutBtn}>
                <LogOut size={16} />
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={login} style={styles.authBtn}>
              <LogIn size={16} />
              Sign in with Google
            </button>
          )}
          <Link to="/" style={styles.homeLink}>
            ← Home
          </Link>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Create Competition */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Plus size={20} />
            Create Competition
          </h2>
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
              <Plus size={16} />
              {loading ? 'Creating...' : 'Create Competition'}
            </button>
          </form>

          <div style={styles.list}>
            <div style={{ ...styles.label, marginBottom: '1rem' }}>
              Your Competitions ({competitions.length})
            </div>
            {competitions.map((comp) => (
              <div
                key={comp.id}
                onClick={() => setSelectedCompetition(comp.id)}
                style={{
                  ...styles.listItem,
                  ...(selectedCompetition === comp.id ? styles.selectedItem : {}),
                }}
              >
                <div style={styles.itemHeader}>
                  {editingCompetition === comp.id ? (
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ ...styles.input, marginBottom: '0.5rem' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        style={{ ...styles.textarea, minHeight: '3rem' }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateCompetition(); }}
                          style={{ ...styles.iconBtn, color: '#00d4ff', borderColor: '#00d4ff' }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingCompetition(null); }}
                          style={styles.iconBtn}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={styles.itemTitle}>{comp.title}</span>
                          <span style={{
                            ...styles.badge,
                            ...(comp.isPublished ? styles.publishedBadge : styles.draftBadge)
                          }}>
                            {comp.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        {comp.description && (
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                            {comp.description}
                          </p>
                        )}
                      </div>
                      <div style={styles.itemActions} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => startEdit(comp)} style={styles.iconBtn} title="Edit">
                          <Edit3 size={14} />
                        </button>
                        {!comp.isPublished ? (
                          <button
                            onClick={() => handlePublishCompetition(comp.id)}
                            style={styles.publishBtn}
                            title="Publish"
                            disabled={comp.contestants?.length < 5}
                          >
                            <Share2 size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(comp.id, comp.isActive)}
                            style={{
                              ...styles.iconBtn,
                              color: comp.isActive ? '#00d4ff' : '#9ca3af',
                            }}
                            title={comp.isActive ? 'Close voting' : 'Open voting'}
                          >
                            {comp.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                        )}
                        <button onClick={() => handleDeleteCompetition(comp.id)} style={styles.deleteBtn} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {editingCompetition !== comp.id && (
                  <div style={styles.itemStats}>
                    <span style={styles.stat}>
                      <Users size={12} />
                      {comp.contestants?.length || 0}
                    </span>
                    <span style={styles.stat}>
                      <Vote size={12} />
                      {comp._count?.votes || 0}
                    </span>
                    {comp.accessCode && (
                      <span style={{ ...styles.stat, color: '#00d4ff' }}>
                        Code: {comp.accessCode}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            {competitions.length === 0 && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                No competitions yet
              </p>
            )}
          </div>
        </div>

        {/* Add Contestants */}
        <div style={styles.card}>
          <h2 style={{ ...styles.cardTitle, color: '#ff006e' }}>
            <Users size={20} />
            Add Contestants
          </h2>

          {!selectedCompetition ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
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
                    style={{ ...styles.textarea, minHeight: '3rem' }}
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
                <button
                  type="submit"
                  disabled={loading}
                  style={{ ...styles.button, background: 'linear-gradient(90deg, #ff006e, #ff9500)' }}
                >
                  <Plus size={16} />
                  {loading ? 'Adding...' : 'Add Contestant'}
                </button>
              </form>

              <div style={styles.list}>
                <div style={{ ...styles.label, marginBottom: '1rem' }}>
                  Contestants ({contestants.length}) {contestants.length < 5 && '- Need at least 5 to publish'}
                </div>
                {contestants.map((contestant) => (
                  <div key={contestant.id} style={{ ...styles.listItem, cursor: 'default' }}>
                    <div style={styles.itemHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {contestant.imageUrl ? (
                          <img
                            src={contestant.imageUrl}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #001d3d, #003566)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            color: '#00d4ff',
                          }}>
                            {contestant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span style={styles.itemTitle}>{contestant.name}</span>
                          {contestant.description && (
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                              {contestant.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleDeleteContestant(contestant.id)} style={styles.deleteBtn}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {contestants.length === 0 && (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                    No contestants yet
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {selectedCompetition && selectedCompetitionData && (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to={`/vote/${selectedCompetition}`}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '9999px',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            Test Voting
          </Link>
          <Link
            to={`/results/${selectedCompetition}`}
            style={{
              padding: '0.875rem 1.5rem',
              border: '1px solid #ff9500',
              color: '#ff9500',
              textDecoration: 'none',
              borderRadius: '9999px',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            <BarChart3 size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            View Results
          </Link>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && publishData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Competition Published!</h3>
            <p style={styles.modalSubtitle}>Share this competition with voters using any of these methods:</p>

            {/* QR Code */}
            <div style={styles.qrWrapper}>
              <QRCodeSVG
                id="qr-code-svg"
                value={publishData.voteUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <button
              onClick={downloadQRCode}
              style={{
                ...styles.button,
                background: 'rgba(255, 255, 255, 0.1)',
                marginBottom: '1.5rem',
              }}
            >
              <Download size={16} />
              Download QR Code
            </button>

            {/* Access Code */}
            <div style={styles.shareOption}>
              <div style={{ ...styles.shareIcon, background: 'rgba(255, 0, 110, 0.2)' }}>
                <QrCode size={20} color="#ff006e" />
              </div>
              <div style={styles.shareInfo}>
                <div style={styles.shareLabel}>Access Code</div>
                <div style={{ ...styles.shareValue, fontSize: '1.25rem', fontWeight: 'bold', color: '#ff006e' }}>
                  {publishData.accessCode}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(publishData.accessCode, 'code')}
                style={styles.copyBtn}
              >
                {copiedField === 'code' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Direct Link */}
            <div style={styles.shareOption}>
              <div style={{ ...styles.shareIcon, background: 'rgba(0, 212, 255, 0.2)' }}>
                <LinkIcon size={20} color="#00d4ff" />
              </div>
              <div style={styles.shareInfo}>
                <div style={styles.shareLabel}>Direct Link</div>
                <div style={styles.shareValue}>{publishData.voteUrl}</div>
              </div>
              <button
                onClick={() => copyToClipboard(publishData.voteUrl, 'link')}
                style={styles.copyBtn}
              >
                {copiedField === 'link' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <button onClick={() => setShowPublishModal(false)} style={styles.closeBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
