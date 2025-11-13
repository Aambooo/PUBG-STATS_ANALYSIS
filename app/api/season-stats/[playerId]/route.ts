// app/api/season-stats/[playerId]/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentSeasonId, getPlayerSeasonStats } from '@/lib/pubg-api';

export async function GET(
  req: NextRequest,
  context: { params: { playerId: string } }
) {
  try {
    const url = new URL(req.url);
    const shard = url.searchParams.get('shard') ?? 'steam';
    const playerId = decodeURIComponent(context.params.playerId);

    // 1) which season is current?
    const seasonId = await getCurrentSeasonId(shard);
    if (!seasonId) {
      return NextResponse.json(
        { error: 'No current season found' },
        { status: 404 }
      );
    }

    // 2) pull raw season stats
    const raw = await getPlayerSeasonStats(playerId, shard, seasonId);

    // 3) shape per-mode stats
    const s = raw?.data?.attributes?.gameModeStats ?? {};
    const modes = ['solo', 'duo', 'squad'] as const;

    const shaped = Object.fromEntries(
      modes.map((m) => {
        const g = s[m] ?? {};
        const rounds = Number(g.roundsPlayed ?? 0);
        const wins = Number(g.wins ?? 0);
        const kills = Number(g.kills ?? 0);
        const damage = Number(g.damageDealt ?? 0);
        const top10s = Number(g.top10s ?? 0);
        const assists = Number(g.assists ?? 0);

        const deaths = Math.max(0, rounds - wins); // approximation
        const kd = deaths > 0 ? +(kills / deaths).toFixed(2) : kills > 0 ? kills : 0;
        const adr = rounds > 0 ? +(damage / rounds).toFixed(1) : 0;
        const winRate = rounds > 0 ? +((wins / rounds) * 100).toFixed(1) : 0;

        return [
          m,
          {
            roundsPlayed: rounds,
            wins,
            winRate,       // %
            kills,
            kd,            // approx K/D
            adr,           // avg damage / round
            top10s,
            assists,
            damageDealt: damage,
          },
        ];
      })
    );

    return NextResponse.json({
      playerId,
      shard,
      seasonId,
      updatedAt: new Date().toISOString(),
      modes: shaped,
    });
  } catch (err) {
    console.error('season-stats error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch season stats' },
      { status: 500 }
    );
  }
}
