import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  description: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

export default mongoose.models.About || mongoose.model("About", aboutSchema);