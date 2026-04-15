import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Education from '@/models/Education';
import cloudinary from "@/lib/cloudinary";

// PUT (Update) Education entry
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15 requires awaiting params
    const formData = await request.formData();
    
    const institution = formData.get("institution");
    const degree = formData.get("degree");
    const duration = formData.get("duration");
    const description = formData.get("description");
    const file = formData.get("image");

    let updateData = { institution, degree, duration, description };

    // If a new image file is provided, upload it
    if (file && typeof file !== "string") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "portfolio_education" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      updateData.image = uploadResponse.secure_url;
    }

    const updatedEdu = await Education.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedEdu) {
        return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEdu);
  } catch (error) {
    console.error("Education PUT error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE Education entry
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const edu = await Education.findById(id);
    if (!edu) {
        return NextResponse.json({ error: "Education entry not found" }, { status: 404 });
    }

    // Optional: Delete the image from Cloudinary to save space
    if (edu.image) {
      try {
        const publicId = edu.image.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(`portfolio_education/${publicId}`);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await Education.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}