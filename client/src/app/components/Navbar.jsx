import React, { useState, useEffect } from 'react';
import { FiGithub, FiLinkedin, FiMail, FiX, FiMenu , FiArrowUpRight} from "react-icons/fi";
import { BsCodeSlash } from "react-icons/bs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10 border-b border-slate-800/50' 
        : 'bg-slate-900/80 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="/" className="group relative flex items-center gap-3">
            <div className="relative">
              <img 
                src="/assets/images/logo.jpg" 
                alt="Bhaskar Budha" 
                className="h-12 w-12 object-cover rounded-2xl border-4 border-slate-800/50 group-hover:border-purple-500/75 shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-500 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent">
                Bhaskar
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Developer</p>
            </div>
          </a>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center space-x-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/projects', label: 'Projects' },
              { href: '/services', label: 'Services' },
              { href: '/contact', label: 'Contact' }
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group relative px-4 py-2 text-slate-400 font-medium rounded-xl hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 border border-slate-800/50 hover:border-purple-500/50 flex items-center gap-2"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 rounded-xl blur-sm transition-all" />
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Social + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a href="https://github.com/Bhaskar787" className="w-10 h-10 bg-slate-800/50 hover:bg-purple-600/20 border border-slate-800/50 hover:border-purple-500/50 rounded-xl flex items-center justify-center text-xl hover:text-purple-400 hover:scale-110 transition-all duration-300" aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="w-10 h-10 bg-slate-800/50 hover:bg-blue-600/20 border border-slate-800/50 hover:border-blue-500/50 rounded-xl flex items-center justify-center text-xl hover:text-blue-400 hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
            </div>
            
            {/* CTA Button */}
            <a
              href="/contact"
              className="group relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 border border-purple-500/50 flex items-center gap-2"
            >
              <span>Let's Talk</span>
              <FiArrowUpRight className="text-sm group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-xl blur-sm transition-opacity" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/50 border border-slate-800/50 hover:bg-slate-700 hover:border-purple-500/50 hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <FiMenu className={`text-xl text-slate-400 group-hover:text-white transition-colors ${isOpen ? 'hidden' : 'block'}`} />
            <FiX className={`text-xl text-slate-400 group-hover:text-white transition-colors ${isOpen ? 'block' : 'hidden'}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
        isOpen 
          ? 'max-h-96 opacity-100 border-t border-slate-800/50' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-slate-900/95 backdrop-blur-xl pt-4 pb-8">
          <ul className="px-6 space-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/projects', label: 'Projects' },
              { href: '/services', label: 'Services' },
              { href: '/contact', label: 'Contact' }
            ].map((item, idx) => (
              <li key={item.href} className="animate-slide-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group block w-full px-6 py-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 border border-slate-800/50 hover:border-purple-500/50 flex items-center gap-3 font-medium"
                >
                  <span className="flex-1">{item.label}</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all" />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Social */}
          <div className="px-6 mt-8 pt-8 border-t border-slate-800/50">
            <div className="flex items-center justify-center gap-6">
              <a href="https://github.com/Bhaskar787" className="w-12 h-12 bg-slate-800/50 hover:bg-purple-600/20 border border-slate-800/50 hover:border-purple-500/50 rounded-xl flex items-center justify-center text-2xl hover:text-purple-400 hover:scale-110 transition-all duration-300" aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="w-12 h-12 bg-slate-800/50 hover:bg-blue-600/20 border border-slate-800/50 hover:border-blue-500/50 rounded-xl flex items-center justify-center text-2xl hover:text-blue-400 hover:scale-110 transition-all duration-300" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
              <a href="mailto:budhabhaskar11@gmail.com" className="w-12 h-12 bg-slate-800/50 hover:bg-emerald-600/20 border border-slate-800/50 hover:border-emerald-500/50 rounded-xl flex items-center justify-center text-2xl hover:text-emerald-400 hover:scale-110 transition-all duration-300" aria-label="Email">
                <FiMail />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}