import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Competition, Contestant } from '../utils/api';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [contestants, setContestants] = useState<Contestant[]>([]);
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

  const loadContestants = async (competitionId: string) => {
    try {
      const { data } = await api.getContestants(competitionId);
      setContestants(data);
    } catch (error) {
      console.error('Failed to load contestants:', error);
    }
  };

  const handleCreateCompetition = async (e: React.FormEvent) => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContestant = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error('Failed to create contestant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContestant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contestant?')) return;

    try {
      await api.deleteContestant(id);
      if (selectedCompetition) {
        await loadContestants(selectedCompetition);
      }
    } catch (error) {
      console.error('Failed to delete contestant:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-display font-bold text-gradient">Admin Panel</h1>
          <Link
            to="/"
            className="px-6 py-3 border border-neon-blue text-neon-blue rounded-full hover:bg-neon-blue hover:text-black transition-all"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Competition */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-3xl font-display font-bold mb-6 text-neon-blue">Create Competition</h2>
            <form onSubmit={handleCreateCompetition} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-400">Title</label>
                <input
                  type="text"
                  value={compTitle}
                  onChange={(e) => setCompTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-neon-blue focus:outline-none text-white"
                  placeholder="e.g., Ultimate Chili Cook-Off 2025"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-400">Description</label>
                <textarea
                  value={compDescription}
                  onChange={(e) => setCompDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-neon-blue focus:outline-none text-white h-24 resize-none"
                  placeholder="Describe the competition..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-neon-blue to-neon-pink rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Competition'}
              </button>
            </form>

            {/* Competitions List */}
            <div className="mt-8">
              <h3 className="text-xl font-display font-bold mb-4 text-gray-300">Active Competitions</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {competitions.map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompetition(comp.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedCompetition === comp.id
                        ? 'bg-neon-blue bg-opacity-20 border border-neon-blue'
                        : 'bg-black border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <h4 className="font-semibold">{comp.title}</h4>
                    {comp.description && <p className="text-sm text-gray-400 mt-1">{comp.description}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      {comp.contestants.length} contestants • {comp._count?.votes || 0} votes
                    </p>
                  </div>
                ))}
                {competitions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No competitions yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Add Contestants */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h2 className="text-3xl font-display font-bold mb-6 text-neon-pink">Add Contestants</h2>

            {!selectedCompetition ? (
              <p className="text-gray-400 text-center py-12">Select a competition to add contestants</p>
            ) : (
              <>
                <form onSubmit={handleCreateContestant} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-400">Name</label>
                    <input
                      type="text"
                      value={contName}
                      onChange={(e) => setContName(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none text-white"
                      placeholder="e.g., Spicy Steve's Chili"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-400">Description</label>
                    <textarea
                      value={contDescription}
                      onChange={(e) => setContDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none text-white h-20 resize-none"
                      placeholder="Brief description..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-400">Image URL (optional)</label>
                    <input
                      type="url"
                      value={contImageUrl}
                      onChange={(e) => setContImageUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-neon-pink to-neon-orange rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Contestant'}
                  </button>
                </form>

                {/* Contestants List */}
                <div className="mt-8">
                  <h3 className="text-xl font-display font-bold mb-4 text-gray-300">
                    Contestants ({contestants.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {contestants.map((contestant) => (
                      <div
                        key={contestant.id}
                        className="p-4 rounded-lg bg-black border border-gray-700 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">{contestant.name}</h4>
                          {contestant.description && (
                            <p className="text-sm text-gray-400 mt-1">{contestant.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteContestant(contestant.id)}
                          className="ml-4 px-3 py-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {contestants.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No contestants yet</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/competitions"
            className="px-8 py-4 bg-neon-blue text-black rounded-full font-semibold hover:scale-105 transition-transform"
          >
            View All Competitions
          </Link>
          {selectedCompetition && (
            <Link
              to={`/vote/${selectedCompetition}`}
              className="px-8 py-4 border border-neon-orange text-neon-orange rounded-full font-semibold hover:bg-neon-orange hover:text-black transition-all"
            >
              Test Voting
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
