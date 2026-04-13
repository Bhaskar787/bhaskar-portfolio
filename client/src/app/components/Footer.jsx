import { FiGithub, FiLinkedin } from "react-icons/fi";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 mt-12"> 
    <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto flex items-start justify-between px-4 mt-2">
        <div className="max-w-7xl  text-start ">
          <h2 className="text-2xl font-semibold">Bhaskar PortFolio</h2>
        &copy; 2024 Bhaskar Budha. All rights reserved.
        </div>


  <div className="mt-2">
  <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
  
 
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

                <div className="justify-content  space-x-2 mt-2">

                  <h2 className="text-2xl font-semibold mb-4 ">Connect</h2>
                  
                   <div className="justify-content flex items-center space-x-2 mt-2 ">
                                  <a href="https://github.com/Bhaskar787" className="hover:text-purple-400 transition-colors text-2xl"><FiGithub /></a>
                                <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="hover:text-purple-400 transition-colors text-2xl"><FiLinkedin /></a>
                              <a
                    href="mailto:budhabhaskar11@gmail.com?subject=Hello Bhaskar&body=I want to contact you."
                    className="hover:text-purple-400 transition-colors text-2xl"
                  >
                     <MdEmail />
                    </a>
                    
                    </div>
                  </div>

        </div>
    </footer>
  );
}