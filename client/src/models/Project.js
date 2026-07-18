import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    githubLink: String,
    liveLink: String,
    description: String,
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

// In dev, Next.js hot-reloads this file but the Node process (and mongoose's
// internal model registry) stays alive. If `skills` was added to the schema
// AFTER the model was first compiled in this process, the old cached model
// (without `skills`) keeps being reused and the field silently never saves
// or returns — so re-deleting the cached model here keeps the schema fresh.
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

const Project = mongoose.model("Project", projectSchema);

export default Project;
