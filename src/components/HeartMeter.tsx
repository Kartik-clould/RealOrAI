"use client";

interface HeartMeterProps {
  lives: number;
  maxLives: number;
  animateLoss?: boolean;
}

export function HeartMeter({ lives, maxLives, animateLoss = false }: HeartMeterProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: maxLives }).map((_, index) => {
        const isActive = index < lives;
        return (
          <div
            key={index}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xl transition-all duration-300 ${
              isActive
                ? "bg-[#dbeafe] text-blue-700 shadow-material-2"
                : "bg-white/70 text-slate-400"
            } ${animateLoss && !isActive ? "animate-heart-loss" : ""}`}
          >
            {isActive ? "❤️" : "🖤"}
          </div>
        );
      })}
    </div>
  );
}
