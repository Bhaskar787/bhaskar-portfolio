import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Project from '@/models/Project';

// GET all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST a new project (JSON body: title, description, image, githubLink, liveLink, skills)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, image, githubLink, liveLink, skills } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newProject = await Project.create({ title, description, image, githubLink, liveLink, skills });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Project POST error:", error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
