import AboutClient from "./AboutClient";
import connectDB from "@/lib/db";
import About from "@/models/About";
import Education from "@/models/Education";
import Skill from "@/models/Skill";
import Experience from "@/models/Experience";

export const metadata = {
  title: "About | Bhaskar Budha",
  description: "Learn more about Bhaskar Budha - Full-Stack Developer & UI Engineer",
};

async function getAboutData() {
  let initialData = {
    about: null,
    education: [],
    skills: [],
    experience: [],
  };

  try {
    await connectDB();
    const [about, education, skills, experience] = await Promise.all([
      About.findOne().sort({ createdAt: -1 }).lean(),
      Education.find().sort({ order: 1, createdAt: -1 }).lean(),
      Skill.find().sort({ order: 1, createdAt: -1 }).lean(),
      Experience.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    initialData = JSON.parse(
      JSON.stringify({
        about: about || null,
        education: education || [],
        skills: skills || [],
        experience: experience || [],
      })
    );
  } catch (err) {
    console.error("SSR getAboutData error:", err);
  }

  return initialData;
}

export default async function Page() {
  const initialData = await getAboutData();
  return <AboutClient initialData={initialData} />;
}