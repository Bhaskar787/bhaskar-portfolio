import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import About from '@/models/About';
import cloudinary from "@/lib/cloudinary";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
   
    const { id } = await params; 
    
    // Parse FormData
    const formData = await request.formData();
    const description = formData.get("description");
    const file = formData.get("image");

    let updateData = { description };

    // Only upload to Cloudinary if a new file is actually sent
    // We check if it's an object (File) and not just a string or null
    if (file && typeof file !== "string" && file.size > 0) {
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
      updateData.image = uploadResponse.secure_url;
    }

    // Update the database
    const updatedAbout = await About.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedAbout) {
      return NextResponse.json({ error: "Bio not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error("About PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const about = await About.findById(id);
    if (about?.image) {
      const publicId = about.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`portfolio_about/${publicId}`).catch(() => null);
    }

    await About.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}