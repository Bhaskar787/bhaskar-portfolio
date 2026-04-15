"use client"
import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]); // Dynamic skills state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetching all data in parallel
        const [projRes, expRes, eduRes, skillRes] = await Promise.all([
          fetch("/api/project"),
          fetch("/api/experience"),
          fetch("/api/education"),
          fetch("/api/skills") 
        ]);

        const projData = await projRes.json();
        const expData = await expRes.json();
        const eduData = await eduRes.json();
        const skillData = await skillRes.json();

        setProjects(projData);
        setExperiences(expData);
        setEducation(eduData);
        setSkills(skillData);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
        <div className="flex-1 space-y-6 max-w-lg text-center md:text-left order-2 md:order-1">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-500 leading-tight">
            Hey, I am <span className="text-white">Bhaskar Budha</span> & 
            I am a Full stack developer.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
            I am a passionate full stack developer with experience in building web applications using modern technologies.
          </p>
          <a href="/projects" className="inline-block px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all">
            View My Work
          </a>
        </div>

        <div className="flex-1 flex justify-center md:justify-end order-1 md:order-2">
          <div className="relative w-48 h-48 md:w-80 md:h-80">
            <img
              className="w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-slate-800"
              src="/assets/images/logo.jpg"
              alt="Bhaskar Budha"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Education Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-wider">Education</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse text-slate-500">Loading Education...</div>
            ) : (
              education.map((edu) => (
                <article key={edu._id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500 transition-all">
                  <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                  <p className="text-purple-400 text-sm font-medium">{edu.institution}</p>
                  <p className="text-slate-500 text-xs mb-2">{edu.duration}</p>
                  <p className="text-slate-400 text-sm">{edu.description}</p>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Skills Section (Dynamic) */}
        <section>
          <h2 className="text-xl font-bold text-slate-400 mb-6 uppercase tracking-wider">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {loading ? (
               <div className="animate-pulse text-slate-500">Loading Skills...</div>
            ) : (
              skills.map((skill) => (
                <div key={skill._id} className="group relative">
                  <span className="px-4 py-2 bg-slate-900 text-slate-300 rounded-lg border border-slate-800 group-hover:border-purple-500 group-hover:text-white transition-all text-sm flex items-center gap-2">
                    {skill.name}
                    {skill.level && (
                      <span className="text-[10px] bg-slate-800 px-1 rounded text-purple-400">
                        {skill.level}%
                      </span>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
          
          {/* Social Links Moved Here for better layout balance */}
          <div className="flex items-center space-x-6 mt-12">
            <a href="https://github.com/Bhaskar787" className="text-slate-400 hover:text-purple-400 text-2xl transition-colors"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="text-slate-400 hover:text-purple-400 text-2xl transition-colors"><FiLinkedin /></a>
            <a href="mailto:budhabhaskar11@gmail.com" className="text-slate-400 hover:text-purple-400 text-2xl transition-colors"><MdEmail /></a>
          </div>
        </section>
      </div>

      <hr className="my-16 border-slate-800" />

      {/* Experience Section */}
      <section className="py-8">
        <span className="text-purple-500 font-medium block text-center mb-2">Professional Journey</span>
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Work Experience</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             <div className="col-span-full text-center animate-pulse text-slate-500">Loading Experience...</div>
          ) : (
            experiences.map((exp) => (
              <article key={exp._id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-purple-500 transition-all">
                {exp.image && <img className="h-30 w-70  object-contain" src={exp.image} alt={exp.title} />}
                <h3 className="text-lg font-bold py-2 text-white">{exp.title}</h3>
                <p className="text-slate-500 text-xs mb-3">{exp.duration}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <hr className="my-16 border-slate-800" />

      {/* Projects Section */}
      <section className="py-8">
        <div className="text-center mb-12  ">
          <h2 className="text-3xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-slate-400">A glimpse into the digital solutions I've engineered.</p>
        </div>

        {loading ? (
          <div className="text-center text-purple-500 animate-pulse">Loading Projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 2).map((project) => (
              //this divneed to change
              <div key={project._id} className=" group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500 transition-all flex flex-col">
                <div className="overflow-hidden rounded-xl mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-slate-400 mb-6 flex-grow">{project.description}</p>
                <div className="flex items-center justify-between">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-full text-purple-500 hover:bg-purple-500 hover:text-white transition-all">
                    <FiGithub size={20} />
                  </a>
                  
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-16 gap-4">
          <a href="/about" className="px-8 py-3 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-all font-medium">Read My Story</a>
          <a href="/contact" className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-500 shadow-lg shadow-purple-500/20 transition-all font-medium">Start a Project</a>
        </div>
      </section>
    </div>
  );
}