import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import Project from "@/models/Project";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connectDB();
    
    // Run counts in parallel fUsing Promise.all in the API is much faster because it counts both collections at the same time instead of waiting for one to finish before starting the next
    const [projectCount, contactCount] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments(),
    ]);

    return NextResponse.json({
      projectCount,
      contactCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}