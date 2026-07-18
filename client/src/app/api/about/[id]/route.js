import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import About from '@/models/About';

// GET a single about doc
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const about = await About.findById(id);
    if (!about) return NextResponse.json({ error: "Bio not found" }, { status: 404 });
    return NextResponse.json(about);
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

// PUT (Update) the about/bio doc — JSON body
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { title, location, bio, image, resume } = body;

    const updatedAbout = await About.findByIdAndUpdate(
      id,
      { title, location, bio, image, resume },
      { new: true, runValidators: true }
    );

    if (!updatedAbout) {
      return NextResponse.json({ error: "Bio not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error("About PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE the about doc
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await About.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
