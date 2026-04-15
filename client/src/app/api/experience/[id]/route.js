import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Experience from '@/models/Experience';
import cloudinary from "@/lib/cloudinary";

// DELETE Experience
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const exp = await Experience.findById(id);
    
    if (!exp) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove image from Cloudinary
    if (exp.image) {
      const publicId = exp.image.split('/').pop().split('.')[0]; 
      await cloudinary.uploader.destroy(`portfolio_experience/${publicId}`);
    }

    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PUT (Edit) Experience
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await request.formData();
    
    const title = formData.get("title");
    const duration = formData.get("duration");
    const description = formData.get("description");
    const file = formData.get("image");

    let updateData = { title, duration, description };

    // If a new image is provided, upload it and update the URL
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
      updateData.image = uploadResponse.secure_url;
    }

    const updatedExp = await Experience.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedExp);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}