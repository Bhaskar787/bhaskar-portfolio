import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: "Frontend" },
  level: { type: Number, min: 1, max: 100, default: 80 },
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model("Skill", skillSchema);
