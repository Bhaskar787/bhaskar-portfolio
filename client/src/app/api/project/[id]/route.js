import { NextResponse } from 'next/server';
import connectDB from "@/lib/db";
import Project from '@/models/Project';
import cloudinary from "@/lib/cloudinary";

// GET a single project
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    
    const { id } = await params; 
    
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

// DELETE a project
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
   
    const { id } = await params;

    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Delete image from Cloudinary if it exists
    if (project.image) {
      try {
        const publicId = project.image.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(`portfolio_projects/${publicId}`);
      } catch (cloudinaryErr) {
        console.error("Cloudinary delete failed:", cloudinaryErr);
      }
    }

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PUT Update a project
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
  
    const { id } = await params;
    
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const githubLink = formData.get("githubLink");
    const file = formData.get("image");

    let updateData = { title, description, githubLink };

    // If a new image file is uploaded, process it
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
      updateData.image = uploadResponse.secure_url;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}