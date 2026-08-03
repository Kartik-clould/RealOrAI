import fs from "fs";
import path from "path";
import { GameImage } from "./types";
import { shuffleArray } from "./images";

export function getAvailableImages(): GameImage[] {
  const images: GameImage[] = [];
  const publicDir = path.join(process.cwd(), "public", "images");

  const realDir = path.join(publicDir, "real");
  if (fs.existsSync(realDir)) {
    const realFiles = fs
      .readdirSync(realDir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    realFiles.forEach((file, index) => {
      images.push({
        id: `real-${index}`,
        src: `/images/real/${file}`,
        type: "real",
        alt: `Real image ${index + 1}`,
      });
    });
  }

  const aiDir = path.join(publicDir, "ai");
  if (fs.existsSync(aiDir)) {
    const aiFiles = fs
      .readdirSync(aiDir)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    aiFiles.forEach((file, index) => {
      images.push({
        id: `ai-${index}`,
        src: `/images/ai/${file}`,
        type: "ai",
        alt: `AI image ${index + 1}`,
      });
    });
  }

  return images;
}

export function selectGameImages(
  totalRounds: number = 12,
  excludeIds: string[] = [],
): GameImage[] {
  const allImages = getAvailableImages();

  const availableImages = allImages.filter((img) => !excludeIds.includes(img.id));

  let realImages = availableImages.filter((img) => img.type === "real");
  let aiImages = availableImages.filter((img) => img.type === "ai");

  const halfRounds = Math.floor(totalRounds / 2);

  if (
    realImages.length < halfRounds ||
    aiImages.length < totalRounds - halfRounds
  ) {
    realImages = allImages.filter((img) => img.type === "real");
    aiImages = allImages.filter((img) => img.type === "ai");
  }

  const shuffledReal = shuffleArray(realImages);
  const shuffledAI = shuffleArray(aiImages);

  const selectedReal = shuffledReal.slice(0, halfRounds);
  const selectedAI = shuffledAI.slice(0, totalRounds - halfRounds);

  return shuffleArray([...selectedReal, ...selectedAI]);
}
