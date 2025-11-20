import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TargetIcon, ShieldIcon, BoltIcon, ChartIcon, SparklesIcon } from '../components/PremiumIcon';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    // Simple entrance animations - no hiding elements
    gsap.fromTo('.hero-content',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.3 }
    );

    // Scroll-triggered animations
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    });

    gsap.utils.toArray('.benefit-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          }
        }
      );
    });

    // Cursor parallax
    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.002;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.002;

      gsap.to('.parallax-bg', {
        x: moveX * 25,
        y: moveY * 25,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const styles = {
    container: {
      background: 'linear-gradient(180deg, #0a1a2e 0%, #000814 100%)',
      color: '#fff',
      width: '100%',
      minHeight: '100vh',
    },
    hero: {
      height: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '2rem',
      overflow: 'hidden',
    },
    parallaxBg: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle at center, rgba(0, 149, 255, 0.25) 0%, rgba(0, 102, 255, 0.12) 30%, transparent 60%)',
      pointerEvents: 'none',
    },
    bgGrid: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'linear-gradient(rgba(0, 149, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 149, 255, 0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      opacity: 0.6,
    },
    heroContent: {
      position: 'relative',
      zIndex: 10,
      textAlign: 'center',
      maxWidth: '75rem',
      width: '100%',
    },
    eyebrow: {
      fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
      fontWeight: '700',
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: '#00d4ff',
      marginBottom: '2rem',
    },
    title: {
      fontSize: 'clamp(6rem, 22vw, 18rem)',
      fontWeight: '900',
      letterSpacing: '-0.06em',
      lineHeight: 0.85,
      marginBottom: '2.5rem',
      color: '#fff',
      textShadow: '0 0 150px rgba(0, 212, 255, 0.6), 0 0 80px rgba(0, 149, 255, 0.4)',
    },
    subtitle: {
      fontSize: 'clamp(1.4rem, 4vw, 2.5rem)',
      fontWeight: '400',
      color: '#e8e8e8',
      maxWidth: '60rem',
      margin: '0 auto 3.5rem',
      lineHeight: 1.5,
    },
    buttonContainer: {
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryButton: {
      padding: '1.75rem 4.5rem',
      fontSize: '1.2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #00d4ff, #0095ff)',
      color: '#0a1a2e',
      border: 'none',
      textDecoration: 'none',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      boxShadow: '0 0 40px rgba(0, 212, 255, 0.4)',
    },
    secondaryButton: {
      padding: '1.75rem 4.5rem',
      fontSize: '1.2rem',
      fontWeight: '700',
      background: 'transparent',
      color: '#00d4ff',
      border: '3px solid #00d4ff',
      textDecoration: 'none',
      display: 'inline-block',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    },
    section: {
      padding: '10rem 2rem',
      background: '#000814',
    },
    sectionEyebrow: {
      fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
      fontWeight: '700',
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: '#00d4ff',
      textAlign: 'center',
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: 'clamp(4rem, 10vw, 8rem)',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '6rem',
      color: '#fff',
      letterSpacing: '-0.03em',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '3rem',
      maxWidth: '80rem',
      margin: '0 auto',
    },
    featureCard: {
      background: 'linear-gradient(135deg, #0d2440 0%, #000814 100%)',
      padding: '4rem 3rem',
      border: '2px solid rgba(0, 212, 255, 0.3)',
      transition: 'all 0.4s ease',
    },
    featureNumber: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#00d4ff',
      marginBottom: '2rem',
      letterSpacing: '0.2em',
    },
    featureTitle: {
      fontSize: '2.8rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#fff',
    },
    featureText: {
      fontSize: '1.2rem',
      color: '#d0d0d0',
      lineHeight: 1.7,
    },
    benefitsSection: {
      padding: '10rem 2rem',
      background: 'linear-gradient(180deg, #000814 0%, #0a1a2e 100%)',
    },
    benefitsList: {
      maxWidth: '65rem',
      margin: '0 auto',
      display: 'grid',
      gap: '2.5rem',
    },
    benefitItem: {
      display: 'flex',
      gap: '2.5rem',
      alignItems: 'flex-start',
      padding: '2.5rem',
      background: 'rgba(0, 212, 255, 0.06)',
      border: '2px solid rgba(0, 212, 255, 0.2)',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
    },
    benefitIcon: {
      fontSize: '3.5rem',
      flexShrink: 0,
    },
    benefitContent: {
      flex: 1,
    },
    benefitTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#00d4ff',
      marginBottom: '1rem',
    },
    benefitText: {
      fontSize: '1.15rem',
      color: '#d0d0d0',
      lineHeight: 1.65,
    },
    ctaSection: {
      padding: '12rem 2rem',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #0a1a2e 0%, #001d3d 100%)',
    },
    ctaTitle: {
      fontSize: 'clamp(4.5rem, 14vw, 10rem)',
      fontWeight: '800',
      marginBottom: '2.5rem',
      color: '#fff',
      letterSpacing: '-0.03em',
      textShadow: '0 0 80px rgba(0, 212, 255, 0.4)',
    },
    ctaText: {
      fontSize: '2rem',
      color: '#d0d0d0',
      marginBottom: '4rem',
    },
    footer: {
      padding: '3.5rem 2rem',
      borderTop: '2px solid rgba(0, 212, 255, 0.25)',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '1rem',
      background: '#000814',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        .hero-button:hover {
          transform: scale(1.08) translateY(-3px);
        }

        .hero-button:nth-child(1):hover {
          background: linear-gradient(135deg, #00e5ff, #00a8ff);
          box-shadow: 0 20px 60px rgba(0, 212, 255, 0.6);
        }

        .hero-button:nth-child(2):hover {
          background: rgba(0, 212, 255, 0.15);
          border-color: #00e5ff;
        }

        .feature-card:hover {
          border-color: rgba(0, 212, 255, 0.7);
          transform: translateY(-12px);
          box-shadow: 0 30px 80px rgba(0, 149, 255, 0.25);
        }

        .benefit-item:hover {
          background: rgba(0, 212, 255, 0.1);
          border-color: rgba(0, 212, 255, 0.4);
        }

        ::selection {
          background: #00d4ff;
          color: #0a1a2e;
        }
      `}</style>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="parallax-bg" style={styles.parallaxBg}></div>
        <div style={styles.bgGrid}></div>

        <div className="hero-content" style={styles.heroContent}>
          <div style={styles.eyebrow}>RANKED VOTING REIMAGINED</div>
          <h1 style={styles.title}>VOTR</h1>
          <p style={styles.subtitle}>
            The future of democratic decision-making. Drag, drop, and decide with precision.
            Powered by Borda Count scoring for fair outcomes.
          </p>
          <div style={styles.buttonContainer}>
            <Link to="/competitions" className="hero-button" style={styles.primaryButton}>
              Start Voting
            </Link>
            <Link to="/admin" className="hero-button" style={styles.secondaryButton}>
              Create Competition
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <div style={styles.sectionEyebrow}>HOW IT WORKS</div>
        <h2 style={styles.sectionTitle}>Three Simple Steps</h2>
        <div style={styles.featuresGrid}>
          <div className="feature-card" style={styles.featureCard}>
            <div style={styles.featureNumber}>01</div>
            <h3 style={styles.featureTitle}>Choose</h3>
            <p style={styles.featureText}>
              Browse active competitions. From chili cook-offs to design contests,
              find what matters to you and make your voice heard.
            </p>
          </div>

          <div className="feature-card" style={styles.featureCard}>
            <div style={styles.featureNumber}>02</div>
            <h3 style={styles.featureTitle}>Rank</h3>
            <p style={styles.featureText}>
              Drag your top 5 choices into ranked slots. Our intuitive drag-and-drop
              interface makes voting feel effortless and engaging.
            </p>
          </div>

          <div className="feature-card" style={styles.featureCard}>
            <div style={styles.featureNumber}>03</div>
            <h3 style={styles.featureTitle}>Decide</h3>
            <p style={styles.featureText}>
              Watch live results unfold with animated leaderboards. Borda Count
              scoring ensures the fairest possible outcomes every time.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section" style={styles.benefitsSection}>
        <div style={styles.sectionEyebrow}>WHY VOTR</div>
        <h2 style={styles.sectionTitle}>Powerful Features</h2>
        <div style={styles.benefitsList}>
          <div className="benefit-item" style={styles.benefitItem}>
            <div style={styles.benefitIcon}><TargetIcon size={56} /></div>
            <div style={styles.benefitContent}>
              <h3 style={styles.benefitTitle}>Fair Borda Count Scoring</h3>
              <p style={styles.benefitText}>
                Our Borda Count system (7-5-3-2-1 points) ensures every ranking matters.
                Unlike simple voting, your full preference order influences the outcome fairly.
              </p>
            </div>
          </div>

          <div className="benefit-item" style={styles.benefitItem}>
            <div style={styles.benefitIcon}><ShieldIcon size={56} /></div>
            <div style={styles.benefitContent}>
              <h3 style={styles.benefitTitle}>Secure & Anonymous</h3>
              <p style={styles.benefitText}>
                Vote with confidence. Each browser gets a unique ID to prevent duplicate votes,
                while keeping your choices completely anonymous.
              </p>
            </div>
          </div>

          <div className="benefit-item" style={styles.benefitItem}>
            <div style={styles.benefitIcon}><BoltIcon size={56} /></div>
            <div style={styles.benefitContent}>
              <h3 style={styles.benefitTitle}>Lightning Fast Interface</h3>
              <p style={styles.benefitText}>
                Built with React, Vite, and GSAP animations for a buttery-smooth experience.
                Drag-and-drop your rankings with zero lag.
              </p>
            </div>
          </div>

          <div className="benefit-item" style={styles.benefitItem}>
            <div style={styles.benefitIcon}><ChartIcon size={56} /></div>
            <div style={styles.benefitContent}>
              <h3 style={styles.benefitTitle}>Real-Time Results</h3>
              <p style={styles.benefitText}>
                Watch the leaderboard update live as votes come in. Beautiful animated
                charts show exactly how contestants rank at any moment.
              </p>
            </div>
          </div>

          <div className="benefit-item" style={styles.benefitItem}>
            <div style={styles.benefitIcon}><SparklesIcon size={56} /></div>
            <div style={styles.benefitContent}>
              <h3 style={styles.benefitTitle}>Easy Competition Creation</h3>
              <p style={styles.benefitText}>
                Admin panel makes it simple to create competitions and add contestants.
                Perfect for events, contests, polls, and community decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.sectionEyebrow}>READY TO START?</div>
        <h2 style={styles.ctaTitle}>Join the Revolution</h2>
        <p style={styles.ctaText}>Make your vote count. Make it ranked.</p>
        <Link to="/competitions" className="hero-button" style={styles.primaryButton}>
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2025 VOTR. Powered by democracy and precision.</p>
      </footer>
    </div>
  );
}
