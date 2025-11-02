'use client';

import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('squad-fpp');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch available seasons on mount
  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await fetch('/api/seasons');
      const data = await response.json();
      
      if (data.success && data.seasons.length > 0) {
        setSeasons(data.seasons);
        // Set the most recent season as default
        setSelectedSeason(data.seasons[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching seasons:', err);
    }
  };

  const fetchLeaderboard = async () => {
    if (!selectedSeason) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `/api/leaderboard?seasonId=${selectedSeason}&gameMode=${selectedMode}`
      );
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.players || []);
      } else {
        setError(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err: any) {
      setError('Failed to fetch leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard when season or mode changes
  useEffect(() => {
    if (selectedSeason) {
      fetchLeaderboard();
    }
  }, [selectedSeason, selectedMode]);

  const gameModes = [
    { value: 'solo-fpp', label: 'Solo FPP' },
    { value: 'solo', label: 'Solo TPP' },
    { value: 'duo-fpp', label: 'Duo FPP' },
    { value: 'duo', label: 'Duo TPP' },
    { value: 'squad-fpp', label: 'Squad FPP' },
    { value: 'squad', label: 'Squad TPP' },
  ];

  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-yellow-500 font-['Oswald'] tracking-wider">
            STAT ARENA
          </a>
        </div>
      </header>

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(115, 115, 115) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto pt-24 px-8 pb-20">
        {/* Back Button */}
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mb-6 transition-colors"
        >
          <span>←</span>
          <span>Back to Home</span>
        </a>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🏆 Leaderboards
          </h1>
          <p className="text-gray-400">Top Players by Season</p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900/50 backdrop-blur-md rounded-xl p-6 border border-neutral-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Season Selector */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              >
                {seasons.length === 0 && <option>Loading seasons...</option>}
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.id.replace('division.bro.official.pc-', 'Season ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Game Mode Selector */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Game Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              >
                {gameModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-neutral-900/50 backdrop-blur-md rounded-xl border border-neutral-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="text-yellow-500 text-4xl mb-4">⏳</div>
              <p className="text-gray-400">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-white font-semibold mb-2">Error</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : leaderboardData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800/50 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Player</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Tier</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Games</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((player: any, index: number) => {
                    return (
                      <tr 
                        key={player.id || index}
                        className="border-b border-neutral-700 hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className={`font-bold ${
                            player.rank === 1 ? 'text-yellow-500 text-2xl' : 
                            player.rank === 2 ? 'text-gray-300 text-xl' : 
                            player.rank === 3 ? 'text-orange-400 text-lg' : 
                            'text-white'
                          }`}>
                            #{player.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a 
                            href={`/player/${player.name}`}
                            className="text-white hover:text-yellow-500 font-semibold transition-colors"
                          >
                            {player.name}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-white font-semibold">
                          {player.stats.rankPoints || 0}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {player.stats.tier || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {player.stats.gamesPlayed || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-400">No leaderboard data available for this season and mode.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}