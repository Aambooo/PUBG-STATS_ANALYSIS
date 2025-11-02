import { NextResponse } from 'next/server';
import { getSeasons } from '@/lib/pubg-api';

export async function GET(request: Request) {
  try {
    const result = await getSeasons('steam');
    
    // Extract just the season IDs and basic info
    const seasons = result.data.map((season: any) => ({
      id: season.id,
      isCurrentSeason: season.attributes.isCurrentSeason,
      isOffseason: season.attributes.isOffseason
    }));
    
    // Sort: current season first, then non-offseasons, then by ID (newest first)
    seasons.sort((a: any, b: any) => {
      if (a.isCurrentSeason) return -1;
      if (b.isCurrentSeason) return 1;
      if (a.isOffseason && !b.isOffseason) return 1;
      if (!a.isOffseason && b.isOffseason) return -1;
      return b.id.localeCompare(a.id);
    });

    return NextResponse.json({
      success: true,
      seasons: seasons
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}