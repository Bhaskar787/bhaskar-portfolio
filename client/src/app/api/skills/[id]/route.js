import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Skill from '@/models/Skill';

// UPDATE a specific skill (PUT)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // { new: true } returns the updated document instead of the old one
    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error("Skill Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

//  DELETE a specific skill (DELETE)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Skill Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

//  GET a single skill (Optional - for edit pages)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}