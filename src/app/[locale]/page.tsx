"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="flex min-h-dvh flex-col bg-gray-50">
      {/* Header */}
      <header className="flex justify-between p-4">
        <div />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-12 text-center">
          {/* Logo */}
          <div className="animate-fade-in space-y-4">
            <h1 className="text-6xl font-bold text-gray-900 md:text-7xl">
              {t("title")}
            </h1>
            <p className="text-xl text-gray-600">{t("subtitle")}</p>
          </div>

          {/* Game Mode Buttons */}
          <div
            className="animate-fade-in grid gap-6 md:grid-cols-2"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Solo Mode */}
            <Link
              href="/solo"
              className="group shadow-material-2 hover:shadow-material-3 rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:scale-105 hover:border-blue-300"
            >
              <div className="mb-4 text-5xl">🎯</div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {t("solo")}
              </h2>
              <p className="text-sm text-gray-600">{t("soloDescription")}</p>
            </Link>

            {/* Multiplayer removed */}
          </div>

          {/* How to Play and FAQ removed */}
        </div>
      </div>

      <Footer />
    </main>
  );
}
