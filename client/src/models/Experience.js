import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, 
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model("Experience", experienceSchema);