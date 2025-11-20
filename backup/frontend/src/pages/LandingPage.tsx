import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animations
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power4.out',
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)',
      });

      // Feature cards scroll animation
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        },
        opacity: 0,
        y: 100,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-neon-blue rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
          <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-neon-pink rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-neon-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl">
          <h1 className="hero-title font-display text-7xl md:text-9xl font-bold mb-6">
            <span className="text-gradient glow-blue">VOTR</span>
          </h1>
          <p className="hero-subtitle text-xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto font-light">
            The future of ranked voting. Drag, drop, and decide with style.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/competitions"
              className="px-12 py-5 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full text-white text-lg font-semibold hover:scale-110 transition-transform duration-300 card-glow"
            >
              Start Voting
            </Link>
            <Link
              to="/admin"
              className="px-12 py-5 border-2 border-neon-orange rounded-full text-neon-orange text-lg font-semibold hover:bg-neon-orange hover:text-black transition-all duration-300"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neon-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neon-blue rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-center mb-20 text-gradient">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="feature-card p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-neon-blue transition-all duration-300 card-glow">
              <div className="text-6xl mb-6">🏁</div>
              <h3 className="text-2xl font-display font-bold mb-4 text-neon-blue">Choose Competition</h3>
              <p className="text-gray-400">
                Browse active competitions and pick your favorite to vote on. From chili cook-offs to design contests.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-neon-pink transition-all duration-300 card-glow">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-display font-bold mb-4 text-neon-pink">Drag & Rank</h3>
              <p className="text-gray-400">
                Drag your top 5 choices into ranked slots. Intuitive interface makes voting feel like a game.
              </p>
            </div>

            <div className="feature-card p-8 rounded-2xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-neon-orange transition-all duration-300 card-glow">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-display font-bold mb-4 text-neon-orange">Watch Results</h3>
              <p className="text-gray-400">
                See live results with animated leaderboards powered by Borda Count scoring. Democracy in motion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-12 glow-pink">
            Built for Speed
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
            Powered by cutting-edge tech for a lightning-fast, buttery-smooth experience.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'GSAP', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-6 py-3 bg-black border border-gray-700 rounded-full text-gray-300 hover:border-neon-blue hover:text-neon-blue transition-all duration-300"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 text-gradient">
            Ready to VOTR?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join the voting revolution. Make your voice heard.
          </p>
          <Link
            to="/competitions"
            className="inline-block px-16 py-6 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-orange rounded-full text-white text-xl font-bold hover:scale-110 transition-transform duration-300 card-glow"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; 2025 VOTR. Powered by democracy and neon lights.</p>
        </div>
      </footer>
    </div>
  );
}
