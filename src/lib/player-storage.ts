export interface LocalPlayerStats {
  id: string;
  name: string;
  gamesPlayed: number;
  totalCorrect: number;
  totalGuesses: number;
  accuracy: number;
  highestScore: number;
  lastScore: number;
  lastPlayed: number;
}

const STORAGE_KEY = "real-or-ai-player-stats";
const NAME_KEY = "real-or-ai-player-name";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getStoredPlayerName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NAME_KEY);
}

export function setStoredPlayerName(name: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAME_KEY, name);
}

export function getPlayerStats(): LocalPlayerStats[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParse<LocalPlayerStats[]>(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function persistPlayerStats(stats: LocalPlayerStats[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function updatePlayerStats(
  name: string,
  score: number,
  correctAnswers: number,
  totalGuesses: number,
): LocalPlayerStats {
  const normalizedName = name.trim() || "Player";
  const currentStats = getPlayerStats();
  const existingIndex = currentStats.findIndex(
    (entry) => entry.name.toLowerCase() === normalizedName.toLowerCase(),
  );
  const previous = existingIndex >= 0 ? currentStats[existingIndex] : null;

  const updated: LocalPlayerStats = {
    id: previous?.id ?? generateId(),
    name: normalizedName,
    gamesPlayed: (previous?.gamesPlayed ?? 0) + 1,
    totalCorrect: (previous?.totalCorrect ?? 0) + correctAnswers,
    totalGuesses: (previous?.totalGuesses ?? 0) + totalGuesses,
    accuracy:
      totalGuesses + (previous?.totalGuesses ?? 0) > 0
        ? Math.round(
            (((previous?.totalCorrect ?? 0) + correctAnswers) /
              ((previous?.totalGuesses ?? 0) + totalGuesses)) *
              100,
          )
        : 0,
    highestScore: Math.max(previous?.highestScore ?? 0, score),
    lastScore: score,
    lastPlayed: Date.now(),
  };

  if (existingIndex >= 0) {
    currentStats[existingIndex] = updated;
  } else {
    currentStats.push(updated);
  }

  persistPlayerStats(currentStats);
  setStoredPlayerName(normalizedName);
  return updated;
}

export function getLeaderboard(): LocalPlayerStats[] {
  return getPlayerStats().sort((a, b) => {
    if (b.highestScore !== a.highestScore) {
      return b.highestScore - a.highestScore;
    }
    return b.accuracy - a.accuracy;
  });
}

export function getSummaryStats() {
  const allPlayers = getPlayerStats();
  const totalPlayers = allPlayers.length;
  const totalGames = allPlayers.reduce((sum, player) => sum + player.gamesPlayed, 0);
  const highestScore = allPlayers.reduce(
    (max, player) => Math.max(max, player.highestScore),
    0,
  );
  return {
    totalPlayers,
    totalGames,
    highestScore,
    topPlayers: getLeaderboard().slice(0, 3),
  };
}
