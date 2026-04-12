export default function Navbar() {
    return (
        <nav className="bg-slate-900 text-slate-400 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4">

                

                 <a href="/" className="text-xl font-bold text-white"><img src="/assets/images/logo.jpg" alt="Logo" className="h-20 w-20 mr-2" /></a>
               
                <ul className="flex space-x-6">
                    <li><a href="/" className="hover:text-purple-400 transition-colors duration-300">Home</a></li>
                    <li><a href="/about" className="hover:text-purple-400 transition-colors duration-300">About</a></li>
                   <li><a href="/projects" className="hover:text-purple-400 transition-colors duration-300">Projects</a></li>

                    <li><a href="/services" className="hover:text-purple-400 transition-colors duration-300">Services</a></li>
                    <li><a href="/contact" className="hover:text-purple-400 transition-colors duration-300">Contact</a></li>
                </ul>
            </div>
        </nav>

    )
}