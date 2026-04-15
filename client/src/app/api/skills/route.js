import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Skill from '@/models/Skill';

// GET all skills
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}




// POST a new skill
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, category, level } = body;

    if (!name) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    const newSkill = await Skill.create({ name, category, level });
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Skill creation failed" }, { status: 500 });
  }
}