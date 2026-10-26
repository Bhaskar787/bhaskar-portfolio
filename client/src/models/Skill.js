import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: "" },
}, { timestamps: true });

if (mongoose.models.Skill) {
  delete mongoose.models.Skill;
}

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
