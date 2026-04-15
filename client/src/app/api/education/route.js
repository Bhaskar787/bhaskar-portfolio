import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Education from '@/models/Education';

// GET all education entries
export async function GET() {
  try {
    await connectDB();
    const education = await Education.find().sort({ createdAt: -1 });
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

// POST a new education entry (JSON only)
export async function POST(request) {
  try {
    await connectDB();
    
    // Parse JSON instead of FormData
    const body = await request.json();
    const { institution, degree, duration, description } = body;

    // Validation
    if (!institution || !degree || !duration) {
      return NextResponse.json(
        { error: "Institution, degree, and duration are required" }, 
        { status: 400 }
      );
    }

    const newEdu = await Education.create({
      institution,
      degree,
      duration,
      description,
    });

    return NextResponse.json(newEdu, { status: 201 });
  } catch (error) {
    console.error("Education POST error:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}