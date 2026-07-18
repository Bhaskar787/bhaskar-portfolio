import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import About from '@/models/About';

// GET the about/bio doc (latest one)
export async function GET() {
  try {
    await connectDB();
    const aboutData = await About.findOne().sort({ createdAt: -1 });
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bio" }, { status: 500 });
  }
}

// POST a new about/bio doc (JSON body: title, location, bio, image)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, location, bio, image, resume } = body;

    if (!bio) {
      return NextResponse.json({ error: "Bio is required" }, { status: 400 });
    }

    const newAbout = await About.create({ title, location, bio, image, resume });
    return NextResponse.json(newAbout, { status: 201 });
  } catch (error) {
    console.error("About POST error:", error);
    return NextResponse.json({ error: "Failed to save bio" }, { status: 500 });
  }
}
