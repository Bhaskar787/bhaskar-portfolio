"use client";
import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiLoader } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function About() {
  const [data, setData] = useState({
    about: null,
    education: [],
    skills: [],
    experience: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [aboutRes, eduRes, skillRes, expRes] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/education"),
          fetch("/api/skills"),
          fetch("/api/experience"),
        ]);

        setData({
          about: await aboutRes.json(),
          education: await eduRes.json(),
          skills: await skillRes.json(),
          experience: await expRes.json(),
        });
      } catch (error) {
        console.error("Error fetching about page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <FiLoader className="animate-spin text-4xl text-purple-500" />
      </div>
    );
  }

  // Group skills by category for the right column
  const categories = ["Frontend", "Backend", "Tools", "Other"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white">
      {/* Header */}
      <h1 className="text-4xl font-bold text-slate-500 mb-12 uppercase tracking-tighter">About me</h1>

      {/* Intro Section - Now Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <p className="text-2xl leading-relaxed text-slate-200">
          {data.about?.description || "Loading biography..."}
        </p>
        <div className="flex justify-center md:justify-end">
          <img
            className="h-auto max-w-full md:max-w-sm object-cover rounded-2xl border-4 border-slate-700 shadow-2xl"
            src={data.about?.image || "/assets/images/budha.png"}
            alt="Bhaskar Budha"
          />
        </div>
      </div>

      {/* Main Content Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Education (5 Cols) */}
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold text-slate-400 mb-8">Education</h2>
          <div className="space-y-6">
            {data.education.map((edu) => (
              <article
                key={edu._id}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500 transition-all duration-300"
              >
                <div className="text-lg font-bold mb-1">
                  {edu.institution} <br />
                  <small className="text-purple-500 font-medium">
                    {edu.duration}
                  </small>
                </div>
                <p className="text-slate-300 text-lg mt-2 font-semibold">{edu.degree}</p>
                <p className="text-slate-500 text-sm mt-1">{edu.description}</p>
              </article>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6 mt-12">
            <a href="https://github.com/Bhaskar787" target="_blank" className="hover:text-purple-400 text-2xl transition-colors"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" target="_blank" className="hover:text-purple-400 text-2xl transition-colors"><FiLinkedin /></a>
            <a href="mailto:budhabhaskar11@gmail.com" className="hover:text-purple-400 text-2xl transition-colors"><MdEmail /></a>
          </div>
        </div>

        {/* Right Column: Skills & Timeline (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Skills Section - Mapped by Category */}
          <section className="bg-slate-900/50 p-8 rounded-xl shadow-lg border border-slate-800">
            <h2 className="text-3xl font-bold mb-8 text-slate-400">
              Skills & Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {categories.map((cat) => (
                <div key={cat}>
                  <h3 className="font-bold text-xl text-purple-500 mb-2">{cat}</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills
                      .filter((s) => s.category === cat)
                      .map((skill, idx, arr) => (
                        <span key={skill._id} className="text-slate-300">
                          {skill.name}{idx < arr.length - 1 ? "," : ""}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Career Timeline Section - From Experience API */}
          <section className="bg-slate-900/50 p-8 rounded-xl shadow-lg border border-slate-800">
            <h2 className="text-3xl font-bold mb-8 text-slate-400">
              Career Timeline
            </h2>
            <ul className="space-y-6">
              {data.experience.map((item) => (
                <li key={item._id} className="border-l-4 border-slate-700 pl-6 hover:border-purple-500 transition-all group">
                  <span className="block font-bold text-purple-400 text-sm mb-1">{item.duration}</span>
                  <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </span>
                  <p className="text-slate-400 text-sm mt-1">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <div className="justify-center mt-20 flex">
        <a 
          href="/contact" 
          className="px-10 py-3 border-2 border-purple-500 text-purple-500 rounded-full font-bold hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-purple-500/10"
        >
          Start a Project
        </a>
      </div>
    </div>
  );
}