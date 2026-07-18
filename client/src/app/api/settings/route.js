import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import SiteSettings from '@/models/SiteSettings';

// GET the site settings doc (latest one)
export async function GET() {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().sort({ createdAt: -1 });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

// POST a new site settings doc (JSON body: siteName, logo)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { siteName, logo } = body;

    const newSettings = await SiteSettings.create({ siteName, logo });
    return NextResponse.json(newSettings, { status: 201 });
  } catch (error) {
    console.error("Site settings POST error:", error);
    return NextResponse.json({ error: "Failed to save site settings" }, { status: 500 });
  }
}
