"use client";

import { LocalPlayerStats } from "@/lib/player-storage";

interface SoloLeaderboardProps {
  players: LocalPlayerStats[];
  latestPlayerName?: string;
}

const rankEmoji = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

export function SoloLeaderboard({ players, latestPlayerName }: SoloLeaderboardProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-material-2 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Leaderboard
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">Top Scores</h2>
          </div>
        </div>

        <div className="space-y-3">
          {players.slice(0, 8).map((player, index) => {
            const isLatest = latestPlayerName
              ? player.name.toLowerCase() === latestPlayerName.toLowerCase()
              : false;
            return (
              <div
                key={player.id}
                className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-3xl border px-4 py-4 transition-all duration-300 ${
                  isLatest
                    ? "border-blue-200 bg-blue-50 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="text-xl font-semibold text-slate-700">
                  {rankEmoji(index + 1)}
                </div>
                <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  <p className="text-sm font-semibold text-slate-900">{player.name}</p>
                  <p className="text-xs text-slate-500">
                    {player.accuracy}% accuracy • {player.gamesPlayed} games
                  </p>
                </div>
                <div className="text-right text-lg font-bold text-slate-900">
                  {player.highestScore}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
