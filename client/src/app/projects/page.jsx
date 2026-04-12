import { FiGithub } from "react-icons/fi";

export default function Projects(){
    return(
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text mb-8 text-slate-500">
                My Projects
            </h1>
            <p className="text-white mb-4">
                Here i have worked on a projects using Mern stack and some other technologies like React, Node.js, express.js, mongoDb, tailwindCSS etc.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-lg shadow-md bg-slate-800">
                        <h2 className="text-2xl font-semibold mb-4">Project 1: E-commerce Website</h2>
                        <a href="https://github.com/Bhaskar787/next-ecommerce" className="text-purple-500 hover:text-purple-700 transition-colors duration-300">
                        <img src="/assets/images/ecommerce.png" alt="ecommerce" className="mb-4 rounded-lg" />
                        </a>
                        <p className="text-white mb-4">
                            Developed a full-stack e-commerce website using the MERN stack. Implemented features such as user authentication, product management, shopping cart,payment integration and order processing.
                        </p>
                        <a href="https://github.com/Bhaskar787/next-ecommerce" className="text-purple-500 hover:text-purple-700 transition-colors duration-300"><FiGithub /></a>
                    </div>
                    <div className="p-6 rounded-lg shadow-md bg-slate-800">
                        <h2 className="text-2xl font-semibold mb-4">Project 2: Chat Application</h2>
                        <a href="https://github.com/Bhaskar787/Chat-app" className="text-purple-500 hover:text-purple-700 transition-colors duration-300">
                        <img src="/assets/images/chatapp.png" alt="Chat App" className="mb-4 rounded-lg" />
                        </a>
                        <p className="text-white mb-4">
                            Created a chat application with real-time chat functionality using socket.io and websockets.
                            </p>
                            <a href="https://github.com/Bhaskar787/Chat-app" className="text-purple-500 hover:text-purple-700 transition-colors duration-300"><FiGithub /></a>
                    </div>

                    <div className="p-6 rounded-lg shadow-md bg-slate-800">
                        <h2 className="text-2xl font-semibold mb-4">Project 3: Portfolio</h2>
                        <a href="https://github.com/Bhaskar787/bhaskar-portfolio-usingmern" className="text-purple-500 hover:text-purple-700 transition-colors duration-300">
                        <img src="/assets/images/portfolio.png" alt="Portfolio" className="mb-4 rounded-lg" />
                        </a>
                        <p className="text-white mb-4">
                            Developed a personal portfolio website using React and Tailwind CSS to showcase my projects, skills, and experience.
                        </p>
                        <a href="https://github.com/Bhaskar787/bhaskar-portfolio-usingmern" className="text-purple-500 hover:text-purple-700 transition-colors duration-300"><FiGithub /></a>
                    </div>
                    <div className="p-6 rounded-lg shadow-md bg-slate-800">
                        <h2 className="text-2xl font-semibold mb-4">Project 4: Newsportal</h2>
                        <a href="https://github.com/Bhaskar787/bankingkhabarpart" className="text-purple-500 hover:text-purple-700 transition-colors duration-300">
                        <img src="/assets/images/newsportal.png" alt="Newsportal" className="mb-4 rounded-lg" />
                        </a>
                        <p className="text-white mb-4">
                            Developed a newsportal website with real-time updates and a clean, responsive design.
                        </p>
                        <a href="https://github.com/Bhaskar787/bankingkhabarpart" className="text-purple-500 hover:text-purple-700 transition-colors duration-300"><FiGithub /></a>
                    </div>
                </div>
        </div>
    )
}