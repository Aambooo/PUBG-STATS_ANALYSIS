// PUBG API Configuration and Helper Functions

const PUBG_API_BASE_URL = 'https://api.pubg.com/shards';
const PUBG_API_KEY = process.env.PUBG_API_KEY;

// Helper function to make API requests
async function pubgFetch(endpoint: string) {
  if (!PUBG_API_KEY) {
    throw new Error('PUBG_API_KEY is not configured');
  }

  const url = `${PUBG_API_BASE_URL}${endpoint}`;
  console.log('Fetching:', url);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${PUBG_API_KEY}`,
      'Accept': 'application/vnd.api+json',
    },
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    // Try to get the error body
    let errorBody = '';
    try {
      errorBody = await response.text();
      console.log('Error response body:', errorBody);
    } catch (e) {
      console.log('Could not read error body');
    }
    
    throw new Error(`PUBG API Error: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

// Search for a player by name
export async function searchPlayer(playerName: string, shard: string = 'steam') {
  const endpoint = `/${shard}/players?filter[playerNames]=${playerName}`;
  return pubgFetch(endpoint);
}

// Get player stats for a season
export async function getPlayerStats(accountId: string, seasonId: string, shard: string = 'steam') {
  const endpoint = `/${shard}/players/${accountId}/seasons/${seasonId}`;
  return pubgFetch(endpoint);
}

// Get match details
export async function getMatchDetails(matchId: string, shard: string = 'steam') {
  const endpoint = `/${shard}/matches/${matchId}`;
  return pubgFetch(endpoint);
}

// Get leaderboard
export async function getLeaderboard(seasonId: string, gameMode: string, shard: string = 'steam') {
  const endpoint = `/${shard}/leaderboards/${seasonId}/${gameMode}`;
  
  console.log('Full PUBG API URL:', `${PUBG_API_BASE_URL}${endpoint}`);
  
  return pubgFetch(endpoint);
}
// Get player's recent matches (from their match list)
export async function getPlayerMatches(accountId: string, shard: string = 'steam') {
  const endpoint = `/${shard}/players/${accountId}`;
  const data = await pubgFetch(endpoint);
  
  // Return the match IDs from relationships
  if (data.data && data.data.relationships && data.data.relationships.matches) {
    return data.data.relationships.matches.data;
  }
  
  return [];
}
// Get clan information
export async function getClanInfo(clanId: string, shard: string = 'steam') {
  const endpoint = `/${shard}/clans/${clanId}`;
  return pubgFetch(endpoint);
}

// Get available seasons
export async function getSeasons(shard: string = 'steam') {
  const endpoint = `/${shard}/seasons`;
  return pubgFetch(endpoint);
}