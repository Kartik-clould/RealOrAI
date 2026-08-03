import { NextRequest, NextResponse } from "next/server";
import { selectGameImages } from "@/lib/image-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeTypes = searchParams.get("includeTypes") === "true";
    const excludeIdsParam = searchParams.get("excludeIds");
    const countParam = parseInt(searchParams.get("count") ?? "12", 10);
    const requestedCount = Number.isFinite(countParam) && countParam > 0 ? Math.min(countParam, 48) : 12;

    const excludeIds: string[] = excludeIdsParam
      ? JSON.parse(decodeURIComponent(excludeIdsParam))
      : [];

    const images = selectGameImages(requestedCount, excludeIds);

    if (includeTypes) {
      return NextResponse.json(images);
    }

    const sanitizedImages = images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
    }));

    return NextResponse.json(sanitizedImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
