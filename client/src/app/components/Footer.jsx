

import { FiGithub, FiLinkedin } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl font-semibold text-white">Bhaskar Portfolio</h2>
          <p className="mt-2 text-sm">
            &copy; {new Date().getFullYear()} Bhaskar Budha. All rights reserved.
          </p>
        </div>

        {/* Quick Links  */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Links</h2>
          <ul className="flex flex-col space-y-2">
            <li>
              <a href="/" className="hover:text-purple-400 transition-colors duration-300">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-purple-400 transition-colors duration-300">About</a>
            </li>
            <li>
              <a href="/projects" className="hover:text-purple-400 transition-colors duration-300">Projects</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-purple-400 transition-colors duration-300">Contact</a>
            </li>
          </ul>
        </div>

        {/* Connect  */}
        <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
          <h2 className="text-xl font-semibold mb-4 text-white">Connect</h2>
          <div className="flex items-center space-x-5">
            <a href="https://github.com/Bhaskar787"  className="hover:text-purple-400 transition-colors text-2xl" target="_blank"  rel="noopener noreferrer"
              
            >
              <FiGithub />
            </a>
            <a 
              href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="hover:text-purple-400 transition-colors text-2xl" target="_blank" rel="noopener noreferrer"
             
            >
              <FiLinkedin />
            </a>
            <a href="mailto:budhabhaskar11@gmail.com?subject=Hello Bhaskar&body=I want to contact you." className="hover:text-purple-400 transition-colors text-2xl"
            >
              <MdEmail />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}