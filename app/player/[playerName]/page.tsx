import { searchPlayer, getPlayerMatches } from '@/lib/pubg-api';
import { notFound } from 'next/navigation';

interface PlayerPageProps {
  params: {
    playerName: string;
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerName } = await params;
  
  try {
    // Search for the player
    const result = await searchPlayer(playerName, 'steam');
    
    // Check if player was found
    if (!result.data || result.data.length === 0) {
      notFound();
    }
    
    const player = result.data[0];
    const playerData = player.attributes;
    const playerId = player.id;
    // Fetch player's recent matches
    const matchesData = await getPlayerMatches(playerId, 'steam');
    const recentMatches = matchesData.slice(0, 3); // Get last 3 matches
    
        // Fetch detailed data for each of the 3 matches
        const matchDetailsPromises = recentMatches.map(async (match: any) => {
          try {
            const response = await fetch(`http://localhost:3000/api/matches?matchId=${match.id}`);
            const data = await response.json();
            return data.success ? data.data : null;
          } catch (error) {
            return null;
          }
        });
    
        const matchDetails = await Promise.all(matchDetailsPromises);
    
    return (
      <div className="relative min-h-screen bg-neutral-950 p-8 overflow-hidden">
        {/* Navbar*/}
        <header className="fixed top-0 left-0 right-0 z-30 bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800">
          <div className="w-full px-6 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-yellow-500 font-['Oswald'] tracking-wider">
              STAT ARENA
            </a>
          </div>
        </header>
        {/* Animated background pattern - same as homepage */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(115, 115, 115) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto pt-24">
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
              {playerData.name}
            </h1>
            <p className="text-gray-400">Player ID: {playerId}</p>
          </div>
          
          {/* Basic Info Card */}
          <div className="bg-neutral-900/50 backdrop-blur-md rounded-xl p-6 border border-neutral-700">
            <h2 className="text-2xl font-bold text-white mb-4">Player Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Platform</p>
                <p className="text-white text-xl font-semibold">{playerData.shardId}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <p className="text-white text-xl font-semibold">{playerData.banType}</p>
              </div>
              {playerData.clanId && (
                <div>
                  <p className="text-gray-400">Clan ID</p>
                  <p className="text-white text-xl font-semibold">{playerData.clanId}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Coming Soon Section */}
          {/* Match History Section */}
          <div className="mt-8 bg-neutral-900/50 backdrop-blur-md rounded-xl p-6 border border-neutral-700">
            <h2 className="text-2xl font-bold text-white mb-4">🎮 Recent Matches</h2>
  
            {matchDetails.length > 0 ? (
              <div className="space-y-4">
                {matchDetails.map((match: any, index: number) => {
                  if (!match || !match.data) return null;
        
                  const matchData = match.data;
                  const matchAttrs = matchData.attributes;
        
                  // Find the player's stats in this match
                  const participants = match.included?.filter((item: any) => item.type === 'participant') || [];
                  const playerParticipant = participants.find((p: any) => 
                    p.attributes.stats.playerId === playerId.replace('account.', '')
                  );
        
                  if (!playerParticipant) return null;
        
                  const stats = playerParticipant.attributes.stats;
        
                  return (
                    <div 
                      key={matchData.id} 
                      className="bg-neutral-800/50 rounded-lg p-5 border border-neutral-700 hover:border-yellow-500/50 transition-colors"
                    >
                      {/* Match Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">
                            {matchAttrs.mapName} - {matchAttrs.gameMode}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(matchAttrs.createdAt).toLocaleDateString()} at {new Date(matchAttrs.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold ${
                          stats.winPlace === 1 
                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500' 
                            : 'bg-neutral-700 text-white'
                        }`}>
                          #{stats.winPlace}
                        </div>
                      </div>
            
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Kills</p>
                          <p className="text-white text-2xl font-bold">{stats.kills}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Damage</p>
                          <p className="text-white text-2xl font-bold">{Math.round(stats.damageDealt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Survival Time</p>
                          <p className="text-white text-2xl font-bold">{Math.round(stats.timeSurvived / 60)}m</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Distance</p>
                          <p className="text-white text-2xl font-bold">{(stats.rideDistance / 1000).toFixed(1)}km</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400">No recent matches found.</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center p-8 overflow-hidden">
        {/* Animated background pattern for error page too */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(115, 115, 115) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 bg-red-500/10 backdrop-blur-xl rounded-xl p-8 border border-red-500/20 max-w-md">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-white mb-2">Failed to fetch player data.</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mt-6 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    );
  }
}