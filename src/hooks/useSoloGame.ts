import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "./useTimer";
import type { GameImage, ImageType } from "@/lib/types";
import { getSeenImageIds, markImagesAsSeen } from "@/lib/seenImages";
import { shuffleArray } from "@/lib/images";

interface SoloGameState {
  status: "loading" | "ready" | "playing" | "showing-result" | "finished";
  currentImage: GameImage | null;
  currentIndex: number;
  score: number;
  lives: number;
  lastVote: ImageType | null;
  lastGuessCorrect: boolean | null;
  totalGuesses: number;
}

const GAME_TIME = 60;
const MAX_LIVES = 4;
const IMAGE_QUEUE_SIZE = 24;
const RESULT_DELAY_MS = 600;

const initialState: SoloGameState = {
  status: "loading",
  currentImage: null,
  currentIndex: 0,
  score: 0,
  lives: MAX_LIVES,
  lastVote: null,
  lastGuessCorrect: null,
  totalGuesses: 0,
};

export function useSoloGame() {
  const [gameState, setGameState] = useState<SoloGameState>(initialState);
  const [images, setImages] = useState<GameImage[]>([]);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timer = useTimer({
    initialTime: GAME_TIME,
    onTimeUp: () => {
      setGameState((prev) => {
        const playedImageIds = images.slice(0, prev.currentIndex + 1).map((img) => img.id);
        if (playedImageIds.length > 0) {
          markImagesAsSeen(playedImageIds);
        }
        return { ...prev, status: "finished" };
      });
    },
    autoStart: false,
  });

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  const loadImages = useCallback(async () => {
    try {
      const seenIds = getSeenImageIds();
      const params = new URLSearchParams({
        includeTypes: "true",
        count: String(IMAGE_QUEUE_SIZE),
      });

      if (seenIds.length > 0) {
        params.set("excludeIds", encodeURIComponent(JSON.stringify(seenIds)));
      }

      const response = await fetch(`/api/images?${params.toString()}`);
      const data = await response.json();
      const shuffled = shuffleArray(data);

      setImages(shuffled);
      setGameState((prev) => ({ ...prev, status: "ready" }));
    } catch (error) {
      console.error("Failed to load images:", error);
      setGameState((prev) => ({ ...prev, status: "ready" }));
    }
  }, []);

  const startGame = useCallback(() => {
    if (images.length === 0) return;

    setGameState({
      status: "playing",
      currentImage: images[0],
      currentIndex: 0,
      score: 0,
      lives: MAX_LIVES,
      lastVote: null,
      lastGuessCorrect: null,
      totalGuesses: 0,
    });

    timer.restart(GAME_TIME);
  }, [images, timer]);

  const endGame = useCallback(() => {
    clearAdvanceTimeout();
    timer.stop();

    setGameState((prev) => {
      const playedImageIds = images.slice(0, prev.currentIndex + 1).map((img) => img.id);
      if (playedImageIds.length > 0) {
        markImagesAsSeen(playedImageIds);
      }
      return { ...prev, status: "finished" };
    });
  }, [clearAdvanceTimeout, images, timer]);

  const advanceToNextImage = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= images.length) {
        const nextImages = shuffleArray(images);
        setImages(nextImages);
        return {
          ...prev,
          status: "playing",
          currentIndex: 0,
          currentImage: nextImages[0] ?? null,
          lastVote: null,
          lastGuessCorrect: null,
        };
      }

      return {
        ...prev,
        status: "playing",
        currentIndex: nextIndex,
        currentImage: images[nextIndex],
        lastVote: null,
        lastGuessCorrect: null,
      };
    });
  }, [images]);

  const submitVote = useCallback(
    (vote: ImageType) => {
      if (gameState.status !== "playing" || gameState.lastVote || !gameState.currentImage) {
        return;
      }

      const isCorrect = vote === gameState.currentImage.type;
      const nextLives = isCorrect ? gameState.lives : gameState.lives - 1;
      const nextScore = isCorrect ? gameState.score + 1 : gameState.score;
      const nextTotalGuesses = gameState.totalGuesses + 1;

      setGameState((prev) => ({
        ...prev,
        status: "showing-result",
        lastVote: vote,
        lastGuessCorrect: isCorrect,
        score: nextScore,
        lives: nextLives,
        totalGuesses: nextTotalGuesses,
      }));

      if (nextLives <= 0) {
        advanceTimeoutRef.current = setTimeout(endGame, RESULT_DELAY_MS);
        return;
      }

      advanceTimeoutRef.current = setTimeout(advanceToNextImage, RESULT_DELAY_MS);
    },
    [advanceToNextImage, endGame, gameState],
  );

  const resetGame = useCallback(() => {
    clearAdvanceTimeout();
    timer.reset(GAME_TIME);
    setGameState(initialState);
    loadImages();
  }, [clearAdvanceTimeout, loadImages, timer]);

  useEffect(() => {
    loadImages();
    return () => {
      clearAdvanceTimeout();
    };
  }, [clearAdvanceTimeout, loadImages]);

  return {
    gameState,
    timeLeft: timer.timeLeft,
    startGame,
    submitVote,
    resetGame,
  };
}
