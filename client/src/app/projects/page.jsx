"use client"

import { useEffect, useState } from "react"
import { 
  FiGithub, 
  FiArrowRight, 
  FiExternalLink,
  FiCode 
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetching projects from API
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/project")
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Shimmer loading component
  const Shimmer = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="shimmer h-96 rounded-3xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.08),transparent),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent)]" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-slide-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 mb-8 mx-auto max-w-max">
            <BsStars className="text-xl text-purple-400" />
            <span className="text-lg font-semibold text-purple-100">Projects</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight mb-6">
            Featured Works
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Handcrafted digital experiences showcasing modern technologies like Next.js, Node.js, MongoDB, and Tailwind CSS.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {loading ? (
            <Shimmer />
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-32 animate-slide-in-up">
              <FiCode className="w-24 h-24 text-slate-600 mx-auto mb-8 opacity-50" />
              <h3 className="text-3xl font-bold text-slate-400 mb-4">No Projects Yet</h3>
              <p className="text-xl text-slate-500 max-w-md mx-auto">
                Exciting projects coming soon. Stay tuned!
              </p>
            </div>
          ) : (
            projects.map((project, idx) => (
              <article
                key={project._id}
                className="group relative bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-slate-800/50 overflow-hidden hover:border-purple-500/75 hover:bg-slate-900/90 transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-6 animate-slide-in-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden rounded-t-3xl">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:rotate-1"
                  />
                  {/* Live Demo Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Live Demo
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mb-8 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['React', 'Next.js', 'Tailwind', 'Node.js'].slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-800/50 backdrop-blur-sm text-slate-400 text-xs rounded-full border border-slate-700/50 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/50 transition-all hover:scale-105"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-slate-300 hover:text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border border-slate-800/50 hover:border-purple-500/50 hover:scale-105"
                    >
                      <FiGithub className="text-xl" />
                      <span>View Code</span>
                      <FiExternalLink className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                    
                    {project.liveLink && (
                      <a 
                        href={project.liveLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group/btn w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-110 hover:rotate-3"
                      >
                        <FiExternalLink className="text-lg" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* CTA Section */}
        {!loading && projects.length > 0 && (
          <div className="text-center mt-32 animate-slide-in-up" style={{ animationDelay: '900ms' }}>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Want Something Custom?
              </h2>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                Let's create your next amazing project together.
              </p>
              <a
                href="/contact"
                className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-3xl hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-3 hover:scale-[1.05] transition-all duration-700 inline-flex items-center gap-3 text-xl"
              >
                <span>Start Your Project</span>
                <FiArrowRight className="text-lg group-hover:translate-x-3 transition-transform" />
                <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}