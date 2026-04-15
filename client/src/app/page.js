"use client"
import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function Home() {

    const [projects, setProjects]= useState([])
    const [loading, setLoading ]= useState(true)
  

  
useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/project"); 
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  const experiences = [
    { title: "React Developer", date: "2022–2023", desc: "Built semantic and accessible websites for small businesses.", img: "/assets/images/react.png" },
    { title: "Backend Developer", date: "2022–2023", desc: "Server-side apps, RESTful APIs and basic DevOps.", img: "/assets/images/nodejs.png" },
    { title: "Full Stack Developer", date: "2023–2024", desc: "Developed full-stack applications using modern technologies.", img: "/assets/images/fullstack.png" },
    { title: "UI Designer", date: "2024–2025", desc: "Design systems, prototypes, and motion interactions.", img: "/assets/images/uiux.png" },
  ];

  

  const faculty=[
    { title: "ISMT College", date: "2022–2025", desc: "Bachelor of Computer System Engineering (BSc.(hons) Computer System Engineering)"}
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
  {/* Hero Section */}
  {/* flex-col stacks them and md:flex-row puts them side-by-side on the large screen */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-8">
    
    {/* LEFT SIDE: Text Content */}
    {/* order-2 md:order-1 ensures text stays on top when stacked if desired */}
    <div className="flex-1 space-y-6 max-w-lg text-center md:text-left order-2 md:order-1">
      <h1 className="text-3xl md:text-5xl font-bold text-slate-500 leading-tight">
        Hey, I am <span className="text-white">Bhaskar Budha</span> & 
        I am a Full stack developer.
      </h1>

      <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
        I am a passionate full stack developer with experience in building web applications using modern technologies.
      </p>
      
      
      <a href="/projects" className="px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all">
        View My Work
      </a>

      
    </div>

    {/* RIGHT SIDE: Image */}
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


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* About Section  link with the about page*/}
        <section className="py-2">

        <div className="p-2 rounded-lg shadow-md">
         
         

          <h1 className="text-xl font-bold text-slate-400 mb-4">Education</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-6 ">
            {faculty.map((exp, index) => (
              <article key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500 transition-all duration-300 ">
                <div className="text-lg font-bold mb-1">
                  {exp.title} <br />
                  <small className="text-slate-500 font-normal">{exp.date}</small>
                </div>
                <p className="text-slate-400 text-sm mt-2">{exp.desc}</p>
              </article>
            ))}
          </div>

          <div className="flex items-center space-x-4 mt-8">
            <a href="https://github.com/Bhaskar787" className="hover:text-purple-400 text-2xl"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="hover:text-purple-400 text-2xl"><FiLinkedin /></a>
            <a href="mailto:budhabhaskar11@gmail.com" className="hover:text-purple-400 text-2xl"><MdEmail /></a>
          </div>
        </div>
        </section>
      </div>
      

     

      <hr className="my-12 border-slate-800" />

      
      <section className="py-8">
        <span className="text-gray-400 block text-center mb-2">What I have done so far</span>
        <h2 className="text-4xl font-bold text-center mb-12">Work Experience</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => (
            <article key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500 transition-all duration-300">
              <img className="h-12 w-12 mb-4 object-contain" src={exp.img} alt={exp.title} />
              <div className="text-lg font-bold mb-1">
                {exp.title} <br />
                <small className="text-slate-500 font-normal">{exp.date}</small>
              </div>
              <p className="text-slate-400 text-sm mt-2">{exp.desc}</p>
            </article>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <a href="/about" className="px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all">
            Read My Story
          </a>
        </div>

              <hr className="my-12 border-slate-800" />


        
      {/*  Projects Section */}
        <div className="flex flex-col items-center justify-center px-4 mt-12">
          <div className="p-2 max-w-7xl text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">Featured Projects</h2>
            <p className="text-gray-400 mb-8">Ready to build something extraordinary? Let's collaborate.</p>

            {loading ? (
              <div className="text-purple-500 animate-pulse">Loading Projects...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Slicing to show only 2 latest projects */}
                {projects.slice(0, 2).map((project) => (
                  <div
                    key={project._id}
                    className="p-6 rounded-lg shadow-md bg-slate-800 border border-slate-800 hover:border-purple-500 transition-all duration-300 flex flex-col text-start"
                  >
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                      {project.title}
                    </h2>

                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="overflow-hidden rounded-lg mb-4 block"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </a>

                    <p className="text-slate-300 mb-4 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-400 text-2xl transition-colors"
                      >
                        <FiGithub />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          <div className="flex justify-center mt-6">
           
            <a href="/contact" className="px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all">Start a Project</a>
          </div>
        </div>
      </div>

        
      </section>
    </div>
  );
}