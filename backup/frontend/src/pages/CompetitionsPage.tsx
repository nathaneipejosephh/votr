import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Competition } from '../utils/api';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompetitions();
  }, []);

  const loadCompetitions = async () => {
    try {
      const { data } = await api.getCompetitions();
      setCompetitions(data.filter((c) => c.isActive));
    } catch (error) {
      console.error('Failed to load competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-display font-bold text-gradient">Competitions</h1>
            <Link
              to="/"
              className="px-6 py-3 border border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-black transition-all"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>

      {/* Competitions Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-2xl text-gray-400 animate-pulse">Loading competitions...</div>
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-2xl text-gray-400 mb-8">No active competitions yet</p>
            <Link
              to="/admin"
              className="inline-block px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-pink rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Create One
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((competition) => (
              <Link
                key={competition.id}
                to={`/vote/${competition.id}`}
                className="group bg-gradient-to-b from-gray-900 to-black rounded-2xl p-8 border border-gray-800 hover:border-neon-blue transition-all duration-300 card-glow hover:scale-105"
              >
                <h2 className="text-3xl font-display font-bold mb-4 group-hover:text-neon-blue transition-colors">
                  {competition.title}
                </h2>
                {competition.description && (
                  <p className="text-gray-400 mb-6 line-clamp-3">{competition.description}</p>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    {competition.contestants.length} contestants
                  </span>
                  <span className="text-neon-blue font-semibold group-hover:glow-blue">
                    Vote Now →
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <Link
                      to={`/results/${competition.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-4 py-2 bg-black border border-gray-700 rounded-lg text-center text-sm hover:border-neon-pink hover:text-neon-pink transition-all"
                    >
                      View Results
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
