import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, required: true },
    image: { type: String, default: "" },
    resume: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model("About", aboutSchema);
