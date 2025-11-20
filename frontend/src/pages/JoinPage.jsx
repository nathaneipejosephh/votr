import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { KeyRound, ArrowRight } from 'lucide-react';

export default function JoinPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.getCompetitionByCode(code);
      navigate(`/vote/${data.id}`);
    } catch (error) {
      console.error('Failed to find competition:', error);
      if (error.response?.status === 404) {
        setError('Invalid access code. Please check and try again.');
      } else if (error.response?.status === 400) {
        setError(error.response.data.error || 'This competition is not active.');
      } else {
        setError('Failed to join. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError('');
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000814 0%, #001d3d 50%, #000814 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    container: {
      width: '100%',
      maxWidth: '450px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(0, 212, 255, 0.2)',
      borderRadius: '24px',
      padding: '3rem 2rem',
      textAlign: 'center',
    },
    iconWrapper: {
      width: '80px',
      height: '80px',
      margin: '0 auto 1.5rem',
      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(255, 0, 110, 0.2) 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    subtitle: {
      color: '#9ca3af',
      marginBottom: '2rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '1.25rem',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: 'white',
      fontSize: '2rem',
      textAlign: 'center',
      letterSpacing: '0.5rem',
      fontWeight: 'bold',
      transition: 'all 0.3s',
      boxSizing: 'border-box',
    },
    inputFocused: {
      borderColor: '#00d4ff',
      boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
    },
    error: {
      color: '#ff006e',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '1rem',
      background: 'linear-gradient(90deg, #00d4ff, #ff006e)',
      border: 'none',
      borderRadius: '12px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '0.5rem',
    },
    submitBtnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '1.5rem 0',
      color: '#6b7280',
      fontSize: '0.875rem',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
      padding: '0 1rem',
    },
    browseLink: {
      color: '#00d4ff',
      textDecoration: 'none',
      fontWeight: '600',
    },
    homeLink: {
      display: 'inline-block',
      marginTop: '2rem',
      color: '#6b7280',
      textDecoration: 'none',
      fontSize: '0.875rem',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <KeyRound size={36} color="#00d4ff" />
          </div>

          <h1 style={styles.title}>Join Competition</h1>
          <p style={styles.subtitle}>Enter the 6-digit access code to vote</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                style={styles.input}
                maxLength={6}
                autoFocus
              />
              {error && <p style={styles.error}>{error}</p>}
            </div>

            <button
              type="submit"
              disabled={code.length !== 6 || loading}
              style={{
                ...styles.submitBtn,
                ...(code.length !== 6 || loading ? styles.submitBtnDisabled : {}),
              }}
            >
              {loading ? 'Joining...' : 'Join Competition'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <Link to="/competitions" style={styles.browseLink}>
            Browse Active Competitions
          </Link>

          <Link to="/" style={styles.homeLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
