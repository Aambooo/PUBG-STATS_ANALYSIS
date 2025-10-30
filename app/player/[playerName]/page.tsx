import { searchPlayer } from '@/lib/pubg-api';
import { notFound } from 'next/navigation';

interface PlayerPageProps {
  params: {
    playerName: string;
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerName } = params;
  
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
    
    return (
      <div className="relative min-h-screen bg-neutral-950 p-8 overflow-hidden">
        {/* Animated background pattern - same as homepage */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(115, 115, 115) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto">
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
          <div className="mt-8 bg-neutral-900/50 backdrop-blur-md rounded-xl p-6 border border-neutral-700">
            <h2 className="text-2xl font-bold text-white mb-4">📊 Statistics Coming Soon</h2>
            <p className="text-gray-400">
              Player stats, match history, and performance charts will be displayed here.
            </p>
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