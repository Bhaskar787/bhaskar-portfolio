import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Project from '@/models/Project';

// GET a single project
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

// PUT (Update) a project — JSON body
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { title, description, image, githubLink, liveLink, skills } = body;

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, image, githubLink, liveLink, skills },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Project PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
