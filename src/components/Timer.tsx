"use client";

import { useTranslations } from "next-intl";

interface TimerProps {
  timeLeft: number;
  totalTime?: number;
}

export function Timer({ timeLeft, totalTime = 60 }: TimerProps) {
  const t = useTranslations("game");
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 12;
  const isCritical = timeLeft <= 5;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          {t("timeRemaining")}
        </span>
        <span
          className={`text-3xl font-bold tabular-nums transition-colors duration-300 ${
            isCritical
              ? "animate-pulse text-red-600"
              : isLow
                ? "text-amber-600"
                : "text-slate-900"
          }`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-linear ${
            isCritical
              ? "bg-red-500"
              : isLow
                ? "bg-amber-400"
                : "bg-linear-to-r from-sky-400 to-slate-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
