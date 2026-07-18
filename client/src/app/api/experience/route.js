import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Experience from '@/models/Experience';

// GET all experiences
export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST a new experience (JSON body: title, duration, description, image)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, duration, description, image } = body;

    if (!title || !duration || !description) {
      return NextResponse.json({ error: "Title, duration, and description are required" }, { status: 400 });
    }

    const newExp = await Experience.create({ title, duration, description, image });
    return NextResponse.json(newExp, { status: 201 });
  } catch (error) {
    console.error("Experience POST error:", error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
