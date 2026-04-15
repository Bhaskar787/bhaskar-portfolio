import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import About from '@/models/About';
import cloudinary from "@/lib/cloudinary";

export async function GET() {
  try {
    await connectDB();
    const aboutData = await About.findOne().sort({ createdAt: -1 }); // Get latest bio
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bio" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();
    const description = formData.get("description");
    const file = formData.get("image");

    let imageUrl = "";
    if (file && typeof file !== "string") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "portfolio_about" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newAbout = await About.create({ description, image: imageUrl });
    return NextResponse.json(newAbout, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save bio" }, { status: 500 });
  }
}