import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import Education from "@/models/Education";
import Project from "@/models/Project";
import Skill from "@/models/Skill";
import About from "@/models/About";
import Experience from "@/models/Experience"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    
   // Run counts in parallel fUsing Promise.all in the API is much faster because it counts both collections at the same time instead of waiting for one to finish before starting the next
    const [projectCount, contactCount, experienceCount, skillCount, educationCount, aboutCount] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      Education.countDocuments(),
      About.countDocuments()
    ]);

    return NextResponse.json({
      projectCount,
      contactCount,
      experienceCount,
      skillCount,
      aboutCount,
      educationCount
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}


 