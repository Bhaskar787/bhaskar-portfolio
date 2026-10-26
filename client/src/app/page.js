import HomeClient from "./HomeClient";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Education from "@/models/Education";
import About from "@/models/About";

export const metadata = {
  title: "Bhaskar Budha | Full-Stack Developer & UI Engineer",
  description: "Portfolio of Bhaskar Budha - Full-Stack Developer & UI Engineer",
};

async function getHomeData() {
  let initialData = {
    projects: [],
    experiences: [],
    skills: [],
    education: [],
    about: null,
  };

  try {
    await connectDB();
    const [projects, experiences, skills, education, about] = await Promise.all([
      Project.find().sort({ order: 1, createdAt: -1 }).lean(),
      Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find().sort({ order: 1, createdAt: -1 }).lean(),
      Education.find().sort({ order: 1, createdAt: -1 }).lean(),
      About.findOne().sort({ createdAt: -1 }).lean(),
    ]);

    initialData = JSON.parse(
      JSON.stringify({
        projects: projects || [],
        experiences: experiences || [],
        skills: skills || [],
        education: education || [],
        about: about || null,
      })
    );
  } catch (err) {
    console.error("SSR getHomeData error:", err);
  }

  return initialData;
}

export default async function Page() {
  const initialData = await getHomeData();
  return <HomeClient initialData={initialData} />;
}