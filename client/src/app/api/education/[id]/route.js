import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Education from '@/models/Education';

// GET a single education entry
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const edu = await Education.findById(id);
    if (!edu) return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
    return NextResponse.json(edu);
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

// PUT (Update) Education entry — JSON body
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { institution, degree, duration, description } = body;

    const updatedEdu = await Education.findByIdAndUpdate(
      id,
      { institution, degree, duration, description },
      { new: true, runValidators: true }
    );

    if (!updatedEdu) {
      return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEdu);
  } catch (error) {
    console.error("Education PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE Education entry
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const edu = await Education.findById(id);
    if (!edu) {
      return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
    }

    await Education.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
