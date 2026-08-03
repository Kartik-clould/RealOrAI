"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface GameImageProps {
  src: string;
  alt?: string;
  showResult?: boolean;
  isReal?: boolean;
  isCorrect?: boolean | null;
}

export function GameImage({
  src,
  alt = "Game image",
  showResult,
  isReal,
  isCorrect,
}: GameImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("game");

  useEffect(() => {
    setIsVisible(false);
    setIsLoading(true);
  }, [src]);

  return (
    <div className="shadow-material-3 relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-4xl border border-white/70 bg-white/80 backdrop-blur-xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/60">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-500 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIsLoading(false);
          requestAnimationFrame(() => setIsVisible(true));
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
        priority
      />
      {showResult && isCorrect !== null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/25 px-6 text-center transition duration-300">
          <div
            className={`inline-flex items-center gap-3 rounded-full px-5 py-3 text-base font-semibold text-white shadow-material-3 ${
              isCorrect ? "bg-emerald-500/90" : "bg-rose-500/90"
            }`}
          >
            <span>{isCorrect ? "✔️" : "✖️"}</span>
            <span>{isCorrect ? t("correct") : t("incorrect")}</span>
          </div>
          <p className="mt-3 rounded-3xl bg-white/85 px-4 py-2 text-sm text-slate-700 shadow-sm">
            {isReal ? t("wasReal") : t("wasAI")}
          </p>
        </div>
      )}
    </div>
  );
}
