import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { api } from '../utils/api';
import { ResultData, Competition } from '../utils/api';

export default function ResultsPage() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [results, setResults] = useState<ResultData | null>(null);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (competitionId) {
      loadResults();
    }
  }, [competitionId]);

  useEffect(() => {
    if (results && results.results.length > 0) {
      animateResults();
    }
  }, [results]);

  const loadResults = async () => {
    if (!competitionId) return;

    try {
      const [resultsRes, compRes] = await Promise.all([
        api.getResults(competitionId),
        api.getCompetition(competitionId),
      ]);
      setResults(resultsRes.data);
      setCompetition(compRes.data);
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateResults = () => {
    const ctx = gsap.context(() => {
      // Animate podium entrance
      gsap.from('.result-card', {
        opacity: 0,
        y: 100,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Animate bars growing
      gsap.from('.result-bar', {
        scaleX: 0,
        duration: 1.2,
        delay: 0.5,
        stagger: 0.15,
        ease: 'power2.out',
        transformOrigin: 'left',
      });

      // Winner celebration
      if (results && results.results.length > 0) {
        gsap.from('.winner-crown', {
          scale: 0,
          rotation: -180,
          duration: 0.8,
          delay: 1.5,
          ease: 'back.out(2)',
        });

        gsap.to('.winner-card', {
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.3), 0 0 80px rgba(255, 0, 255, 0.2)',
          duration: 1,
          delay: 1.8,
          repeat: -1,
          yoyo: true,
        });
      }
    }, resultsRef);

    return () => ctx.revert();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-gray-400 animate-pulse">Loading results...</div>
      </div>
    );
  }

  if (!results || !competition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-8">Results not found</p>
          <Link to="/competitions" className="px-8 py-4 bg-neon-blue text-black rounded-full font-semibold">
            Back to Competitions
          </Link>
        </div>
      </div>
    );
  }

  const maxPoints = results.results.length > 0 ? results.results[0].totalPoints : 1;

  return (
    <div ref={resultsRef} className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-display font-bold text-gradient mb-2">Results</h1>
              <h2 className="text-2xl text-gray-400">{competition.title}</h2>
            </div>
            <Link
              to="/competitions"
              className="px-6 py-3 border border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-black transition-all"
            >
              ← Competitions
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-4xl font-bold text-neon-blue">{results.totalVotes}</div>
            <div className="text-gray-400 mt-2">Total Votes</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-4xl font-bold text-neon-pink">{results.results.length}</div>
            <div className="text-gray-400 mt-2">Contestants</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="text-4xl font-bold text-neon-orange">{maxPoints}</div>
            <div className="text-gray-400 mt-2">Top Score</div>
          </div>
        </div>

        {/* Results */}
        {results.results.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl text-gray-400">No votes yet. Be the first to vote!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.results.map((result, index) => {
              const barWidth = (result.totalPoints / maxPoints) * 100;
              const isWinner = index === 0;

              return (
                <div
                  key={result.id}
                  className={`result-card relative bg-gradient-to-r from-gray-900 to-black rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isWinner ? 'winner-card border-neon-blue' : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {/* Winner Crown */}
                  {isWinner && (
                    <div className="winner-crown absolute -top-4 -right-4 text-6xl">
                      👑
                    </div>
                  )}

                  <div className="flex items-center gap-6 relative z-10">
                    {/* Position */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                          index === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-600 to-orange-800 text-white'
                            : 'bg-gray-800 text-gray-300'
                        }`}
                      >
                        #{result.position}
                      </div>
                    </div>

                    {/* Contestant Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        {result.imageUrl && (
                          <img
                            src={result.imageUrl}
                            alt={result.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className={`text-2xl font-display font-bold ${isWinner ? 'glow-blue' : ''}`}>
                            {result.name}
                          </h3>
                          {result.description && (
                            <p className="text-gray-400 text-sm mt-1">{result.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                        <div
                          className={`result-bar absolute inset-y-0 left-0 rounded-lg ${
                            isWinner
                              ? 'bg-gradient-to-r from-neon-blue to-neon-pink'
                              : 'bg-gradient-to-r from-gray-700 to-gray-600'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-semibold">
                          <span>{result.totalPoints} points</span>
                          <span>{result.voteCount} votes</span>
                        </div>
                      </div>

                      {/* Rank Breakdown */}
                      <div className="flex gap-2 mt-3 text-xs text-gray-500">
                        {[1, 2, 3, 4, 5].map((rank) => (
                          <div key={rank} className="flex items-center gap-1">
                            <span>#{rank}:</span>
                            <span className="font-semibold">{result.rankCounts[rank] || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 flex gap-4 justify-center">
          <Link
            to={`/vote/${competitionId}`}
            className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Vote Again
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
