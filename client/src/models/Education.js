import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  duration: { type: String, required: true }, 
  description: { type: String }
  
}, { timestamps: true });

export default mongoose.models.Education || mongoose.model("Education", educationSchema);