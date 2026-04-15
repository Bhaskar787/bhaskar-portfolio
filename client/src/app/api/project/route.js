import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Project from '@/models/Project';
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    
    const title = formData.get("title");
    const description = formData.get("description");
    const githubLink = formData.get("githubLink");
    const file = formData.get("image");

    let imageUrl = "";

    if (file && typeof file !== "string") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "portfolio_projects" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newProject = await Project.create({
      title,
      description,
      githubLink,
      image: imageUrl,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}