import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/pubg-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seasonId = searchParams.get('seasonId');
    const gameMode = searchParams.get('gameMode') || 'squad-fpp';
    const shard = searchParams.get('shard') || 'steam';

    if (!seasonId) {
      return NextResponse.json(
        { success: false, error: 'Season ID is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to fetch leaderboard:');
    console.log('Season:', seasonId);
    console.log('Game Mode:', gameMode);
    console.log('Shard:', shard);

    try {
      const result = await getLeaderboard(seasonId, gameMode, shard);
      console.log('SUCCESS! Got result:', JSON.stringify(result).substring(0, 500));
      
      // Process the leaderboard data
      const players = result.data.map((entry: any, index: number) => {
        const stats = entry.attributes.stats || {};
        
        return {
          id: entry.id,
          rank: entry.attributes.rank || (index + 1),
          name: entry.attributes.name,
          stats: {
            rankPoints: stats.rankPoints || stats.rating || 0,
            wins: stats.wins || 0,
            gamesPlayed: stats.games || stats.roundsPlayed || 0,
            winRatio: stats.winRatio || 0,
            tier: stats.tier || stats.rankTier || 'N/A',
            subTier: stats.subTier || ''
          }
        };
      });

      return NextResponse.json({
        success: true,
        players: players.slice(0, 100),
        seasonId,
        gameMode
      });
    } catch (apiError: any) {
      console.error('PUBG API ERROR Details:');
      console.error('Error message:', apiError.message);
      console.error('Full error:', apiError);
      
      return NextResponse.json({
        success: false,
        error: apiError.message,
        details: {
          seasonId,
          gameMode,
          shard,
          errorType: apiError.constructor.name
        }
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('General error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}