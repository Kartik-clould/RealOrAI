"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GameImage } from "@/components/GameImage";
import { HeartMeter } from "@/components/HeartMeter";
// LanguageSwitcher removed - single-language site
import { Footer } from "@/components/Footer";
import { Timer } from "@/components/Timer";
import { VoteButtons } from "@/components/VoteButtons";
import { SoloLeaderboard } from "@/components/SoloLeaderboard";
import { useSoloGame } from "@/hooks/useSoloGame";
import {
  getLeaderboard,
  getStoredPlayerName,
  getSummaryStats,
  setStoredPlayerName,
  updatePlayerStats,
} from "@/lib/player-storage";

export default function SoloPage() {
  const t = useTranslations("game");
  const tLeaderboard = useTranslations("leaderboard");
  const { gameState, timeLeft, startGame, submitVote, resetGame } = useSoloGame();

  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [summaryStats, setSummaryStats] = useState(getSummaryStats());
  const [latestPlayerName, setLatestPlayerName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [hasSavedResult, setHasSavedResult] = useState(false);

  useEffect(() => {
    setReady(true);
    const stored = getStoredPlayerName();
    if (stored) {
      setPlayerName(stored);
    }
    setLeaderboard(getLeaderboard());
    setSummaryStats(getSummaryStats());
  }, []);

  useEffect(() => {
    if (gameState.status !== "finished" || !playerName.trim() || hasSavedResult) {
      return;
    }

    const updated = updatePlayerStats(
      playerName,
      gameState.score,
      gameState.score,
      gameState.totalGuesses,
    );

    setLeaderboard(getLeaderboard());
    setSummaryStats(getSummaryStats());
    setLatestPlayerName(updated.name);
    setHasSavedResult(true);
  }, [gameState.status, gameState.score, gameState.totalGuesses, playerName, hasSavedResult]);

  const handleStart = () => {
    const trimmed = playerName.trim();
    if (!trimmed) return;
    setStoredPlayerName(trimmed);
    setHasSavedResult(false);
    startGame();
  };

  const accuracy = gameState.totalGuesses
    ? Math.round((gameState.score / gameState.totalGuesses) * 100)
    : 0;

  const topPlayers = summaryStats.topPlayers || [];

  if (!ready || gameState.status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
        <div className="space-y-4 rounded-4xl border border-slate-200 bg-white/95 p-10 text-center shadow-material-3">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500" />
          <p className="text-sm font-semibold text-slate-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (gameState.status === "ready") {
    return (
      <main className="flex min-h-dvh flex-col bg-slate-50">
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900">
              ← {t("back")}
            </Link>
            <h1 className="text-4xl font-semibold text-slate-900">{t("title")}</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">{t("description")}</p>
          </div>
          <div className="flex items-center gap-4">
            <div />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-10">
          <div className="rounded-4xl border border-white/70 bg-white/80 p-8 shadow-material-3 backdrop-blur-xl transition duration-300 hover:-translate-y-1">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{t("enterName")}</p>
              <div className="flex w-full gap-4 items-center">
                <input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder={t("enterName")}
                />
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!playerName.trim()}
                  className="inline-flex items-center justify-center rounded-3xl bg-sky-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {t("startButton")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  const isPlaying = gameState.status === "playing" || gameState.status === "showing-result";

  return (
    <main className="bg-slate-50 pb-10">
      <header className="border-b border-slate-200 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">
              ← {t("back")}
            </Link>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{t("liveRush")}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">{playerName || t("guestPlayer")}</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 xl:grid-cols-[1.8fr_1fr] xl:items-start">
        <div className="space-y-6">
          <div className="rounded-4xl border border-white/80 bg-white/80 p-6 shadow-material-3 backdrop-blur-xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{t("currentGame")}</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">{t("puzzleRush")}</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                <span className={isPlaying ? "h-2 w-2 rounded-full bg-emerald-500" : "h-2 w-2 rounded-full bg-rose-500"} />
                {isPlaying ? t("live") : t("gameOver")}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("currentScore")}</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">{gameState.score}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("timeRemaining")}</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">{timeLeft}s</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("remainingLives")}</p>
                <div className="mt-3">
                  <HeartMeter lives={gameState.lives} maxLives={4} animateLoss={gameState.lastGuessCorrect === false} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-white/80 bg-white/80 p-6 shadow-material-3 backdrop-blur-xl">
            <GameImage
              src={gameState.currentImage?.src ?? ""}
              alt={gameState.currentImage?.alt}
              showResult={gameState.status === "showing-result"}
              isReal={gameState.currentImage?.type === "real"}
              isCorrect={gameState.lastGuessCorrect}
            />
          </div>

          <div className="rounded-4xl border border-white/80 bg-white/80 p-6 shadow-material-3 backdrop-blur-xl">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("makeYourPick")}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">{t("chooseTheImage")}</h3>
                </div>
                <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">{t("accuracy")} {accuracy}%</div>
              </div>

              <VoteButtons
                onVote={submitVote}
                disabled={gameState.lastVote !== null}
                selectedVote={gameState.lastVote}
                correctAnswer={gameState.currentImage?.type}
                showResult={gameState.status === "showing-result"}
                size="large"
              />

              {gameState.lastGuessCorrect !== null && (
                <div className={`rounded-3xl border px-4 py-3 text-center text-sm font-semibold ${
                  gameState.lastGuessCorrect
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}>
                  {gameState.lastGuessCorrect ? t("correctAnswer") : t("wrongAnswer")}
                </div>
              )}

              {gameState.status === "finished" && (
                <button
                  onClick={resetGame}
                  className="w-full rounded-3xl bg-sky-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-sky-700"
                >
                  {t("playAgain")}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-white/80 bg-white/80 p-6 shadow-material-3 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t("localStats")}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{t("yourProgress")}</h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{summaryStats.totalPlayers}</p>
                <p>{t("totalPlayers")}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{summaryStats.totalGames}</p>
                <p>{t("totalGames")}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{summaryStats.highestScore}</p>
                <p>{t("highestScore")}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{topPlayers[0]?.name ?? t("noPlayers")}</p>
                <p>{t("topPlayer")}</p>
              </div>
            </div>
          </div>

          <SoloLeaderboard players={topPlayers} latestPlayerName={latestPlayerName ?? undefined} />
        </aside>
      </div>

      <section className="mx-auto mt-10 max-w-6xl px-6">
        <div className="overflow-hidden rounded-4xl border border-white/80 bg-white/80 shadow-material-3 backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{tLeaderboard("title")}</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900">{tLeaderboard("subtitle")}</h3>
            </div>
            <p className="text-sm text-slate-500">{tLeaderboard("latestHighlight")}</p>
          </div>

          <div className="overflow-x-auto px-6 pb-6">
            <table className="min-w-full border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-4 py-4">{tLeaderboard("rank")}</th>
                  <th className="px-4 py-4">{tLeaderboard("playerName")}</th>
                  <th className="px-4 py-4 text-right">{tLeaderboard("score")}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => {
                  const isLatest = latestPlayerName
                    ? player.name.toLowerCase() === latestPlayerName.toLowerCase()
                    : false;
                  return (
                    <tr
                      key={player.id}
                      className={`rounded-3xl border border-slate-200 bg-white transition duration-200 ${
                        isLatest ? "bg-sky-50 ring-1 ring-sky-200" : ""
                      }`}
                    >
                      <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-700">{index + 1}</td>
                      <td className="px-4 py-4 align-middle text-sm text-slate-900">{player.name}</td>
                      <td className="px-4 py-4 align-middle text-right text-sm font-semibold text-slate-900">{player.highestScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
