import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne().sort({ createdAt: -1 }).lean();
    const iconUrl = doc?.favicon || doc?.logo;

    if (iconUrl) {
      const res = await fetch(iconUrl);
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "image/jpeg";
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=10, s-maxage=10, stale-while-revalidate=59",
          },
        });
      }
    }
  } catch (err) {
    console.error("API /api/favicon error:", err);
  }

  // Fallback monogram SVG icon (purple BB)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#7c5cfc"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="28" font-weight="900">BB</text></svg>`;
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60",
    },
  });
}
