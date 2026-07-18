import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import SiteSettings from '@/models/SiteSettings';

// GET a single settings doc
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const settings = await SiteSettings.findById(id);
    if (!settings) return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

// PUT (Update) the site settings doc — JSON body
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { siteName, logo } = body;

    const updatedSettings = await SiteSettings.findByIdAndUpdate(
      id,
      { siteName, logo },
      { new: true, runValidators: true }
    );

    if (!updatedSettings) {
      return NextResponse.json({ error: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Site settings PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE the settings doc
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await SiteSettings.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
