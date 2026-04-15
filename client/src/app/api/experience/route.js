import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";

import cloudinary from "@/lib/cloudinary";
import Experience from '@/models/Experience';

// GET all experiences
export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST a new experience (with Cloudinary image)
export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    
    const title = formData.get("title");
    const duration = formData.get("duration");
    const description = formData.get("description");
    const file = formData.get("image");

    let imageUrl = "";

    if (file && typeof file !== "string") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "portfolio_experience" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newExp = await Experience.create({
      title,
      duration,
      description,
      image: imageUrl,
    });

    return NextResponse.json(newExp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}