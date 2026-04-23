"use client";
import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import { BsStars, BsBook, BsCodeSlash, BsBriefcase } from "react-icons/bs";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center">
        <div className="text-center animate-slide-in-up">
          <FiLoader className="animate-spin w-16 h-16 text-purple-400 mx-auto mb-8" />
          <h2 className="text-2xl font-bold text-slate-300">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.08),transparent),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent)]" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-slide-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 mb-8 mx-auto max-w-max">
            <BsStars className="text-xl text-purple-400" />
            <span className="text-lg font-semibold text-purple-100">About Me</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight mb-6">
            The Story Behind
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {data.about?.description || "Passionate full-stack developer crafting exceptional digital experiences."}
          </p>
        </div>

        {/* Profile & Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24 animate-slide-in-up delay-200">
          <div>
            <img
              className="w-full max-w-md mx-auto lg:mx-0 h-96 object-cover rounded-3xl shadow-2xl border-4 border-slate-800/50 hover:border-purple-500/75 hover:scale-105  transition-all duration-500 cursor-pointer"
              src={data.about?.image || "/assets/images/logo.jpg"}
              alt="Bhaskar Budha"
            />
          </div>
          
          <div className="space-y-8 animate-slide-in-right">
            <div>
              <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Full Stack Developer
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                {data.about?.bio || "Crafting pixel-perfect web experiences with modern technologies."}
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all">
                <BsBriefcase className="w-12 h-12 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white">2+</div>
                <div className="text-slate-400 text-sm">Years Exp</div>
              </div>
              <div className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all">
                <BsBook className="w-12 h-12 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white">50+</div>
                <div className="text-slate-400 text-sm">Projects</div>
              </div>
              <div className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all">
                <BsStars className="w-12 h-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white">99%</div>
                <div className="text-slate-400 text-sm">Client Satisfaction</div>
              </div>
              <div className="group p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-pink-500/50 hover:bg-slate-900/80 transition-all">
                <BsCodeSlash className="w-12 h-12 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black text-white">10+</div>
                <div className="text-slate-400 text-sm">Tech Stack</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Education */}
          <section className="animate-slide-in-left delay-400">
            <h2 className="text-4xl font-black text-slate-200 mb-12 flex items-center gap-4">
              <BsBook className="text-purple-400 text-3xl" />
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, idx) => (
                <article
                  key={edu._id}
                  className="group relative bg-slate-900/70 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/90 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-3">{edu.degree}</h3>
                    <p className="text-purple-400 font-semibold mb-2">{edu.institution}</p>
                    <p className="text-slate-500 mb-4">{edu.duration}</p>
                    <p className="text-slate-400">{edu.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="animate-slide-in-right delay-400">
            <h2 className="text-4xl font-black text-slate-200 mb-12 flex items-center gap-4">
              <BsCodeSlash className="text-emerald-400 text-3xl" />
              Skills & Tools
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {data.skills.map((skill, idx) => (
                <div
                  key={skill._id}
                  className="group relative p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/80 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-purple-500/25"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-lg">{skill.name}</span>
                    {skill.level && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                        {skill.level}%
                      </span>
                    )}
                  </div>
                  {skill.level && (
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full shadow-md transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Experience Timeline */}
        <section className="mt-24 animate-slide-in-up delay-600">
          <h2 className="text-4xl font-black text-slate-200 mb-16 flex items-center gap-4 justify-center">
            <BsBriefcase className="text-blue-400 text-3xl" />
            Professional Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500 opacity-20" />
            <div className="grid gap-8 md:grid-cols-2">
              {data.experience.map((exp, idx) => (
               <article
  key={exp._id}
  className={`group relative flex items-start gap-6 p-8 bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-slate-800/50 hover:border-blue-500/75 hover:bg-slate-900/90 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/25 animate-slide-in-up ${idx % 2 === 0 ? 'md:pr-0 md:border-r-4 md:border-r-blue-500/30' : 'md:pl-0 md:border-l-4 md:border-l-blue-500/30 md:text-right md:translate-x-8'}`}
  style={{ animationDelay: `${idx * 150}ms` }}
>
  {/* Larger Duration Box */}
<div className={`flex-shrink-0 w-24 h-14 lg:w-28 lg:h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border-2 border-white/20 backdrop-blur-sm ${idx % 2 === 0 ? 'order-1' : 'order-2 md:order-1'}`}>
  <span className="font-mono font-bold text-xs lg:text-sm xl:text-base text-white uppercase tracking-widest px-2 py-1 text-center drop-shadow-md whitespace-nowrap">
    {exp.duration}
  </span>
</div>
  
  <div className="flex-1 relative z-10">
    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
      {exp.title}
    </h3>
    <p className="text-slate-400 leading-relaxed mb-4 text-lg">
      {exp.description}
    </p>
  </div>
</article>
              ))}
            </div>
          </div>
        </section>

        {/* Social & CTA */}
        <div className="text-center mt-24 animate-slide-in-up delay-800">
          <div className="max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-black text-white mb-6">
              Let's Create Something Amazing
            </h3>
            <p className="text-xl text-slate-400 mb-8">
              Ready to bring your vision to life? I'm just an email away.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center justify-center gap-8 mb-12">
            <a 
              href="https://github.com/Bhaskar787" 
              target="_blank" 
              className="group w-16 h-16 bg-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-slate-800/50 hover:border-purple-500/75 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:shadow-purple-500/25 transition-all duration-400 hover:scale-110 hover:rotate-12 hover:-translate-y-2"
              rel="noopener noreferrer"
            >
              <FiGithub className="group-hover:text-white" />
            </a>
            <a 
              href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" 
              target="_blank" 
              className="group w-16 h-16 bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 border border-slate-800/50 hover:border-blue-500/75 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-400 hover:scale-110 hover:rotate-12 hover:-translate-y-2"
              rel="noopener noreferrer"
            >
              <FiLinkedin className="group-hover:text-white" />
            </a>
            <a 
              href="mailto:budhabhaskar11@gmail.com" 
              className="group w-16 h-16 bg-slate-900 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-500 border border-slate-800/50 hover:border-emerald-500/75 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:shadow-emerald-500/25 transition-all duration-400 hover:scale-110 hover:rotate-12 hover:-translate-y-2"
            >
              <FiMail className="group-hover:text-white" />
            </a>
          </div>

          {/* CTA */}
          <a
            href="/contact"
            className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-3xl hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-3 hover:scale-[1.05] transition-all duration-700 inline-flex items-center gap-3 text-xl mx-auto block max-w-max"
          >
            <span>Start Collaboration</span>
            <FiArrowRight className="text-lg group-hover:translate-x-3 transition-transform" />
            <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
          </a>
        </div>
      </div>
    </div>
  );
}