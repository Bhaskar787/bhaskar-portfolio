import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    githubLink: String,
    description: String,
  },
  { timestamps: true }
);


const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;