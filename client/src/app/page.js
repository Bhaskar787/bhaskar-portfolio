"use client"
import { useEffect, useState } from "react";
import { 
  FiGithub, 
  FiLinkedin, 
  FiMail, 
  FiArrowUpRight,
  FiExternalLink 
} from "react-icons/fi";
import { 
  BsCodeSlash, 
  BsBriefcase, 
  BsBook, 
  BsStars,
  BsArrowRight,
  BsPlayFill
} from "react-icons/bs";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

  const shimmer = `relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent),radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.3),transparent),radial-gradient(circle_at_40%_40%,rgba(120,119,198,0.2),transparent)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:px-8 relative z-10">
        {/* Hero Section */}
        <section className="relative mb-32">
          {/* Floating Elements */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 text-center lg:text-left">
            {/* Hero Content */}
            <div className="lg:flex-1 space-y-8 max-w-xl mx-auto lg:mx-0 order-2 lg:order-1 animate-slide-in-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 animate-float">
                <BsStars className="text-purple-400" />
                <span className="text-sm font-medium text-purple-100">Full Stack Developer</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
                  Hey, I'm <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Bhaskar Budha</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Crafting pixel-perfect web experiences with modern technologies. 
                  I turn ideas into reality.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="/about" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-500 hover:to-pink-500 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
                >
                  View My Story 
                  <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center gap-4">
                  <a href="https://github.com/Bhaskar787" className="w-12 h-12 bg-slate-800/50 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl hover:text-purple-400 transition-all duration-300 hover:scale-110" aria-label="GitHub">
                    <FiGithub />
                  </a>
                  <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="w-12 h-12 bg-slate-800/50 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl hover:text-blue-400 transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
                    <FiLinkedin />
                  </a>
                  <a href="mailto:budhabhaskar11@gmail.com" className="w-12 h-12 bg-slate-800/50 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl hover:text-emerald-400 transition-all duration-300 hover:scale-110" aria-label="Email">
                    <FiMail />
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2 animate-slide-in-right">
              <div className="relative group">
                <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl -z-10 animate-spin-slow" />
                  <img
                    className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-slate-800/50 group-hover:border-purple-500/75 transition-all duration-500 relative z-10 hover:scale-105 hover:rotate-3"
                    src="/assets/images/logo.jpg"
                    alt="Bhaskar Budha"
                  />
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 text-center">
          <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-purple-500/50 transition-all duration-300 animate-float">
            <BsCodeSlash className="text-3xl text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-slate-400 text-sm">Projects</div>
          </div>
          <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-blue-500/50 transition-all duration-300 animate-float delay-200">
            <BsBriefcase className="text-3xl text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">2+</div>
            <div className="text-slate-400 text-sm">Years Exp</div>
          </div>
          <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-emerald-500/50 transition-all duration-300 animate-float delay-400">
            <BsBook className="text-3xl text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">B.Tech</div>
            <div className="text-slate-400 text-sm">Degree</div>
          </div>
          <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-pink-500/50 transition-all duration-300 animate-float delay-600">
            <BsStars className="text-3xl text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">99%</div>
            <div className="text-slate-400 text-sm">Uptime</div>
          </div>
        </div>

        {/* Skills & Education Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-24">
          {/* Education */}
          <section className="animate-slide-in-left">
            <h2 className="flex items-center gap-3 text-2xl font-black text-slate-200 mb-10 uppercase tracking-wider">
              <BsBook className="text-purple-400" />
              Education
            </h2>
            <div className="space-y-6">
              {loading ? (
                <div className={`${shimmer} h-32 rounded-2xl`} />
              ) : (
                education.map((edu, idx) => (
                  <article 
                    key={edu._id} 
                    className="group bg-slate-900/70 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/90 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">{edu.degree}</h3>
                      <p className="text-purple-400 font-semibold mb-3">{edu.institution}</p>
                      <p className="text-slate-500 mb-4">{edu.duration}</p>
                      <p className="text-slate-400 leading-relaxed">{edu.description}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Skills */}
          <section className="animate-slide-in-right">
            <h2 className="flex items-center gap-3 text-2xl font-black text-slate-200 mb-10 uppercase tracking-wider">
              <BsCodeSlash className="text-purple-400" />
              Skills & Expertise
            </h2>
            <div className="space-y-8">
              {loading ? (
                <div className={`${shimmer} h-48 rounded-2xl`} />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {skills.slice(0, 8).map((skill, idx) => (
                      <div 
                        key={skill._id} 
                        className="group relative p-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/80 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <span className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {skill.name}
                        </span>
                        {skill.level && (
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {skill.level}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Social Links */}
                  <div className="pt-8 border-t border-slate-800/50">
                    <div className="flex items-center gap-6">
                      <a href="https://github.com/Bhaskar787" className="group w-14 h-14 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-purple-600 hover:to-pink-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 hover:rotate-12" aria-label="GitHub">
                        <FiGithub className="group-hover:text-white" />
                      </a>
                      <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="group w-14 h-14 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-blue-600 hover:to-blue-500 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 hover:rotate-12" aria-label="LinkedIn">
                        <FiLinkedin className="group-hover:text-white" />
                      </a>
                      <a href="mailto:budhabhaskar11@gmail.com" className="group w-14 h-14 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-emerald-600 hover:to-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 hover:rotate-12" aria-label="Email">
                        <FiMail className="group-hover:text-white" />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-24" />

        {/* Experience Section */}
        <section className="mb-32 animate-slide-in-up">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 text-purple-400 font-medium mb-4">
              <BsBriefcase className="text-lg" />
              Professional Journey
            </span>
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
              Work Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${shimmer} h-64 rounded-3xl`} />
              ))
            ) : (
              experiences.map((exp, idx) => (
                <article 
                  key={exp._id}
                  className="group relative bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-slate-800/50 p-8 hover:border-purple-500/75 hover:bg-slate-900/90 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                  {exp.image && (
                    <div className="relative z-10 mb-6 overflow-hidden rounded-2xl h-40">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={exp.image} 
                        alt={exp.title} 
                      />
                    </div>
                  )}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white mb-3 group-hover:text-purple-400 transition-colors">{exp.title}</h3>
                    <p className="text-slate-500 font-medium mb-4">{exp.duration}</p>
                    <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-24" />

        {/* Projects Section */}
        <section className="animate-slide-in-up">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A glimpse into the digital solutions I've engineered with cutting-edge technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
                      {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className={`${shimmer} h-96 rounded-3xl`} />
              ))
            ) : (
              projects.slice(0, 2).map((project, idx) => (
                <article 
                  key={project._id}
                  className="group relative bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden hover:border-purple-500/75 hover:bg-slate-900/90 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-6"
                  style={{ animationDelay: `${idx * 200}ms` }}
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden rounded-t-3xl h-80">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 shadow-2xl"
                      >
                        <FiGithub />
                      </a>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-10">
                    <h3 className="text-3xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 mb-8 leading-relaxed line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                        <span className="flex items-center gap-2">
                          <BsPlayFill className="text-purple-400" />
                          Live Demo
                        </span>
                      </div>
                      
                      <a 
                        href={project.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                      >
                        View Code
                        <FiArrowUpRight className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* CTA Buttons */}
        <div className="text-center space-y-8 animate-slide-in-up">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-black text-white mb-6">
              Ready to bring your vision to life?
            </h3>
            <p className="text-xl text-slate-400 mb-8">
              Let's collaborate on your next big project. I'm available for exciting opportunities.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="/projects" 
              className="group relative px-10 py-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-white font-semibold rounded-3xl hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-500 text-lg flex items-center gap-3 w-fit mx-auto"
            >
              <span>View All Projects</span>
              <BsArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </a>
            
            <a 
              href="/contact" 
              className="group px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold rounded-3xl hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 text-lg flex items-center gap-3 w-fit mx-auto relative overflow-hidden"
            >
              <span>Start a Project</span>
              <BsArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-3xl" />
            </a>
          </div>
        </div>

        {/* Scroll to Top Indicator */}
        <div className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-2xl hover:shadow-purple-500/50 cursor-pointer opacity-0 invisible group hover:scale-110 transition-all duration-300 z-50 animate-slide-in-bottom" 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             title="Back to top"
        >
          <FiArrowUpRight />
        </div>
      </div>

     
    </div>
  );
}