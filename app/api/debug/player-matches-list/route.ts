import { NextResponse } from 'next/server';
import { searchPlayerRaw } from '@/lib/pubg-api'; // or reuse your searchPlayer but return the raw JSON

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get('name') ?? 'shroud';
  const shard = url.searchParams.get('shard') ?? 'steam';

  try {
    // Make sure this returns the RAW player JSON from PUBG (not pre-shaped)
    const raw = await searchPlayerRaw(name, shard); 
    const players = raw?.data ?? [];
    const first = players[0];
    const matches = first?.relationships?.matches?.data ?? [];
    return NextResponse.json({
      name, shard,
      idsReturned: matches.length,
      sampleIds: matches.slice(0, 10).map((m: any) => m.id),
      note: 'idsReturned is the exact count your key currently exposes for this player',
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
