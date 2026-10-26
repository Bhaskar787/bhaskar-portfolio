import ProjectsClient from "./ProjectsClient";
import connectDB from "@/lib/db";
import Project from "@/models/Project";

export const metadata = {
  title: "Projects | Bhaskar Budha",
  description: "Explore featured projects and work by Bhaskar Budha",
};

async function getInitialProjects() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    if (projects) {
      return JSON.parse(JSON.stringify(projects));
    }
  } catch (err) {
    console.error("SSR getInitialProjects error:", err);
  }
  return [];
}

export default async function Page() {
  const initialProjects = await getInitialProjects();
  return <ProjectsClient initialProjects={initialProjects} />;
}
