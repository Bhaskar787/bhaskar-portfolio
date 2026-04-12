import { FiGithub, FiLinkedin } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function About() {
  const faculty = [
    {
      title: "ISMT College",
      date: "2022–2025",
      desc: "Bachelor of Computer System Engineering (BSc.(hons) Computer System Engineering)",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white">
      {/* Header */}
      <h1 className="text-4xl font-bold text-slate-500 mb-12">About me</h1>

      {/* Intro Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <p className="text-2xl leading-relaxed">
          I am Bhaskar Budha, a passionate full-stack developer with experience
          in building web applications using modern technologies. I enjoy
          creating efficient and scalable solutions to complex problems.
        </p>
        <div className="flex justify-end">
          <img
            className="h-auto max-w-full md:max-w-md object-contain rounded-lg border-4 border-slate-500"
            src="/assets/images/bhaskar.png"
            alt="profile"
          />
        </div>
      </div>

      {/* Main Content Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Education  */}
        <div className="lg:col-span-5">
          
          <div className="space-y-6">
            
            {faculty.map((exp, index) => (
              <article
                key={index}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500 transition-all duration-300"
              >
                <h2 className="text-3xl font-bold text-slate-400 mb-8">Education</h2>
                <div className="text-lg font-bold mb-1">
                  {exp.title} <br />
                  <small className="text-slate-500 font-normal">
                    {exp.date}
                  </small>
                </div>
                <p className="text-slate-400 text-lg mt-2">{exp.desc}</p>
              </article>
            ))}
          </div>

                     <div className="flex items-center space-x-4 mt-8">
            <a href="https://github.com/Bhaskar787" className="hover:text-purple-400 text-2xl"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="hover:text-purple-400 text-2xl"><FiLinkedin /></a>
            <a href="mailto:budhabhaskar11@gmail.com" className="hover:text-purple-400 text-2xl"><MdEmail /></a>
          </div>
          


          
        </div>

        {/* Right Column: Skills & Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Skills Section */}
          <section className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-slate-400">
              Skills & Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl text-purple-600">Frontend</h3>
                <p className="text-slate-300">HTML, CSS, JavaScript, React</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-purple-600">Backend</h3>
                <p className="text-slate-300">Node.js, Express, REST APIs</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-purple-600">Design</h3>
                <p className="text-slate-300">Figma, Prototyping</p>
              </div>
              <div>
                <h3 className="font-bold text-xl text-purple-600">Other</h3>
                <p className="text-slate-300">Git, GitHub, CI/CD, Testing</p>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-slate-400">
              Career Timeline
            </h2>
            <ul className="space-y-6">
              {[
                { date: "2022–2023", role: "React Developer" },
                { date: "2022–2023", role: "Node.js Developer" },
                { date: "2023–2024", role: "Backend Developer" },
                { date: "2024–Present", role: "Full-Stack projects" },
              ].map((item, i) => (
                <li key={i} className="border-l-4 border-slate-600 pl-4 hover:border-purple-500 transition-colors">
                  <span className="block font-bold text-white">{item.date}</span>
                  <span className="text-slate-300">{item.role}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

      </div>
      <div className="space-x-4 justify-center mt-12 flex">
           
            <a href="/contact" className="px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all">Start a Project</a>
          </div>
    </div>
  );
}