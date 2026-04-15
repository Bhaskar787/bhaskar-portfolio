"use client"

import { useEffect, useState } from "react"
import { FiGithub } from "react-icons/fi"


export default function Projects(){
  const [projects, setProjects]= useState([])
  const [loading, setLoading ]= useState(true)

  // fetching the projects from the api/project/route
  const fetchProjects = async()=>{
    try {
      const res = await fetch("api/project")
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetcing projects:",error)
      
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchProjects()
  },[])
  return(
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-500">My projects</h1>
      <p className="text-white mb-8">
        Here are the projects that I have worked on using modern technologies like Next.js, Node.js, MongoDb, and Tailwind CSS.
      </p>

      {loading ?(
        <div className="text-white text-center py-20 "> Loading the Projects</div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project)=>(
            <div key={project._id} className="p-6 rounded-lg shadow-md bg-slate-800 border border-slate-800 hover:border-purple-500 transition-all duration-300 flex flex-col">
              {/* projects title */}
              <h2 className="text-2xl font-semibold mb-4 text-white">
                {project.title}
              </h2>

              {/* projects image */}
              <div className="relative group overflow-hidden rounded-lg mb-4">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"/>
              </div>
             {/* Project Description */}
              <p className="text-slate-300 mb-6 flex-grow">
                {project.description}
              </p>

              {/* Project Links */}
              <div className="flex items-center justify-between mt-auto">
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  <FiGithub size={20} />
                  <span>View Code</span>
                </a>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-10">
              No projects uploaded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
