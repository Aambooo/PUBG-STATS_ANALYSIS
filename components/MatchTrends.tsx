'use client';

import { useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type ApiResp = {
  playerName: string;
  shard: string;
  limit: number;
  stale: boolean;
  lastFetchedAt: string | null;
  matches: any[];
};

function getMyStats(match: any, playerName: string) {
  const me = (match?.included ?? []).find(
    (x: any) =>
      x.type === 'participant' &&
      x?.attributes?.stats?.name?.toLowerCase() === playerName.toLowerCase()
  );
  const s = me?.attributes?.stats;
  const a = match?.data?.attributes;

  const ride = Number(s?.rideDistance ?? 0); // meters
  const walk = Number(s?.walkDistance ?? 0); // meters
  const timeSurvived = Number(s?.timeSurvived ?? 0); // seconds
  const damage = Number(s?.damageDealt ?? 0);

  return {
    kills: Number(s?.kills ?? 0),
    damage,
    timeSurvived, // sec
    distanceKm: (ride + walk) / 1000, // km
    createdAt: a?.createdAt ?? null,
    mapName: a?.mapName ?? '-',
    gameMode: a?.gameMode ?? '-',
  };
}

export default function MatchTrends({
  playerName,
  limit = 20,
}: {
  playerName: string;
  limit?: number;
}) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<'kills' | 'damage' | 'adr'>('kills');
  const [warming, setWarming] = useState(false); // true while polling for fresh cache
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ----- helpers -----
  const fetchCached = async () => {
    const res = await fetch(
      `/api/player-matches/${encodeURIComponent(playerName)}?limit=${limit}`,
      { cache: 'no-store' }
    );
    return (await res.json()) as ApiResp;
  };

  const fetchWithRefresh = async () => {
    const res = await fetch(
      `/api/player-matches/${encodeURIComponent(playerName)}?limit=${limit}&refresh=1`,
      { cache: 'no-store' }
    );
    return (await res.json()) as ApiResp;
  };

  const startPollingUntilReady = () => {
    // poll up to ~1 minute (6 attempts x 10s)
    let tries = 0;
    setWarming(true);

    // clear any previous polling
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      tries += 1;
      try {
        const json = await fetchCached();
        // stop when we actually have matches (cache filled) or became non-stale
        if ((json.matches?.length ?? 0) > 0 && !json.stale) {
          setData(json);
          setWarming(false);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (tries >= 6) {
          // give up after ~1 minute
          setData(json);
          setWarming(false);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // ignore; keep polling until max tries
        if (tries >= 6 && pollRef.current) {
          clearInterval(pollRef.current);
          setWarming(false);
        }
      }
    }, 10_000);
  };

  // ----- initial load -----
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const json = await fetchCached();
        setData(json);

        // If cache is empty or flagged stale, kick a background refresh AND start polling.
        const noMatches = !json.matches || json.matches.length === 0;
        if (noMatches || json.stale) {
          // fire a refresh (await it so the server populates cache asap)
          await fetchWithRefresh();
          // then poll until the DB has the fresh data
          startPollingUntilReady();
        }
      } finally {
        setLoading(false);
      }
    })();

    // cleanup on unmount
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName, limit]);

  // ----- skeleton -----
  if (loading && !data) {
    return (
      <div className="rounded-xl border border-neutral-800 p-6">
        <div className="h-6 w-48 bg-neutral-800 animate-pulse mb-4" />
        <div className="h-40 bg-neutral-900/60 rounded animate-pulse" />
      </div>
    );
  }

  // ----- rows -----
  const rows =
    (data?.matches ?? [])
      .slice()
      .reverse()
      .map((m: any, idx: number) => {
        const s = getMyStats(m, data!.playerName);
        const adr =
          s.timeSurvived > 0 ? +(s.damage / (s.timeSurvived / 60)).toFixed(1) : 0; // dmg/min
        const label = s.createdAt
          ? new Date(s.createdAt).toLocaleString(undefined, { timeZone: 'Asia/Kathmandu' })
          : `#${idx + 1}`;
        return {
          idx: idx + 1,
          kills: s.kills,
          damage: Math.round(s.damage),
          adr,
          survivalMin: Math.round(s.timeSurvived / 60),
          distanceKm: +s.distanceKm.toFixed(1),
          label,
          mapName: s.mapName,
          gameMode: s.gameMode,
          createdAt: s.createdAt,
        };
      });

  const labelFmt = (label: unknown) => {
    const i = Math.max(0, Number(label) - 1);
    return rows[i]?.label ?? `Match ${label as string}`;
  };

  const colorMap = {
    kills: '#fbbf24', // yellow
    damage: '#60a5fa', // blue
    adr: '#34d399',    // green
  };

  const metricLabel = {
    kills: 'Kills',
    damage: 'Damage',
    adr: 'ADR (Damage per Min)',
  };

  // ---- summary numbers for the current metric ----
  const values = rows.map((r) => r[metric] as number);
  const avg =
    values.length ? +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  const best = values.length ? Math.max(...values) : 0;
  const last = values.length ? values[values.length - 1] : 0;

  // ---- CSV download ----
  const downloadCSV = () => {
    const headers = [
      'Index',
      'DateTime_NPT',
      'Map',
      'Mode',
      'Kills',
      'Damage',
      'ADR',
      'Survival_Min',
      'Distance_Km',
    ];

    const lines = rows.map((r) => [
      r.idx,
      r.label,          // already Nepal time
      r.mapName,
      r.gameMode,
      r.kills,
      r.damage,
      r.adr,
      r.survivalMin,
      r.distanceKm,
    ]);

    const toCsv = (val: unknown) => {
      const s = String(val ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const csv =
      [headers, ...lines]
        .map((row) => row.map(toCsv).join(','))
        .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data?.playerName ?? 'player'}_last_${limit}_matches.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-neutral-800 p-6">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold text-white">
          Match Trends (last {limit})
        </h2>

        <div className="flex items-center gap-2">
          {/* Download */}
          <button
            onClick={downloadCSV}
            className="px-3 py-1.5 rounded text-sm font-semibold bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700"
            title="Download CSV of the last matches (from cache)"
          >
            Download CSV
          </button>

          {/* Toggle buttons */}
          {(['kills', 'damage', 'adr'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors duration-200 ${
                metric === m
                  ? 'bg-yellow-500 text-black'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {metricLabel[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Warming banner while waiting for background refresh to fill cache */}
      {warming && (
        <div className="mb-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 p-3 text-sm">
          Fetching fresh match data… this can take ~20–60 seconds on a new player. The chart will update automatically.
        </div>
      )}

      {/* Summary chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className="rounded-lg bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="text-neutral-400 text-xs">Average</div>
          <div className="text-white text-lg font-bold">{avg}</div>
        </div>
        <div className="rounded-lg bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="text-neutral-400 text-xs">Best</div>
          <div className="text-white text-lg font-bold">{best}</div>
        </div>
        <div className="rounded-lg bg-neutral-900/60 border border-neutral-800 p-3">
          <div className="text-neutral-400 text-xs">Last Match</div>
          <div className="text-white text-lg font-bold">{last}</div>
        </div>
      </div>

      <div className="text-sm text-neutral-400 mb-3">
        {data?.lastFetchedAt
          ? `Updated ${new Date(data.lastFetchedAt).toLocaleString(undefined, {
              timeZone: 'Asia/Kathmandu',
            })}`
          : ''}
      </div>

      {!rows.length ? (
        <p className="text-neutral-400">No matches to chart yet.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="idx"
                tick={{ fill: '#aaa' }}
                label={{
                  value: 'Match (old → new)',
                  position: 'insideBottom',
                  offset: -2,
                  fill: '#aaa',
                }}
              />
              <YAxis tick={{ fill: '#aaa' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                labelFormatter={((label: unknown) => {
                  const i = Math.max(0, Number(label) - 1);
                  return rows[i]?.label ?? `Match ${label as string}`;
                }) as unknown as any}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={metric}
                name={{ kills: 'Kills', damage: 'Damage', adr: 'ADR (Damage per Min)' }[metric]}
                stroke={{ kills: '#fbbf24', damage: '#60a5fa', adr: '#34d399' }[metric]}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
