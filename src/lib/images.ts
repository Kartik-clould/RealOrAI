import { GameImage } from "./types";

// Shuffle array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Select images for a game (50/50 split, 12 total by default)
// excludeIds: optional array of image IDs to exclude (for no-repeat functionality)
export function selectGameImages(
  totalRounds: number = 12,
  excludeIds: string[] = [],
): GameImage[] {
  const allImages = getAvailableImages();

  // Filter out excluded images
  const availableImages = allImages.filter(
    (img) => !excludeIds.includes(img.id),
  );

  // Separate by type
  let realImages = availableImages.filter((img) => img.type === "real");
  let aiImages = availableImages.filter((img) => img.type === "ai");

  const halfRounds = Math.floor(totalRounds / 2);

  // If we don't have enough unseen images, reset and use all images
  if (
    realImages.length < halfRounds ||
    aiImages.length < totalRounds - halfRounds
  ) {
    console.log(
      "Not enough unseen images, resetting to use all available images",
    );
    realImages = allImages.filter((img) => img.type === "real");
    aiImages = allImages.filter((img) => img.type === "ai");
  }

  // Shuffle and select
  const shuffledReal = shuffleArray(realImages);
  const shuffledAI = shuffleArray(aiImages);

  const selectedReal = shuffledReal.slice(0, halfRounds);
  const selectedAI = shuffledAI.slice(0, totalRounds - halfRounds);

  // Combine and shuffle for random order
  return shuffleArray([...selectedReal, ...selectedAI]);
}

// For client-side use - gets images via API
export async function fetchGameImages(): Promise<GameImage[]> {
  const response = await fetch("/api/images");
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return response.json();
}
