

import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-900 text-slate-400 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        
        {/* Logo */}
        <a href="/" className="text-xl font-bold text-white">
          <img src="/assets/images/logo.jpg" alt="Logo" className="h-16 w-16" />
        </a>

        {/* Hamburger Button  */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        {/* Desktop Links (Hidden on Mobile) */}
        <ul className="hidden md:flex space-x-8">
          <li><a href="/" className="hover:text-purple-400 transition">Home</a></li>
          <li><a href="/about" className="hover:text-purple-400 transition">About</a></li>
          <li><a href="/projects" className="hover:text-purple-400 transition">Projects</a></li>
          <li><a href="/services" className="hover:text-purple-400 transition">Services</a></li>
          <li><a href="/contact" className="hover:text-purple-400 transition">Contact</a></li>
        </ul>
      </div>

      {/* Mobile Links (Only shows when isOpen is true) */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-slate-800 border-t border-slate-700 mt-4`}>
        <ul className="flex flex-col p-4 space-y-4">
          <li><a href="/" className="block hover:text-purple-400">Home</a></li>
          <li><a href="/about" className="block hover:text-purple-400">About</a></li>
          <li><a href="/projects" className="block hover:text-purple-400">Projects</a></li>
          <li><a href="/services" className="block hover:text-purple-400">Services</a></li>
          <li><a href="/contact" className="block hover:text-purple-400">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}


// import React, { useState } from 'react';

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const navLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Services", path: "/services" },
//     { name: "Projects", path: "/projects" },
//     { name: "Contact", path: "/contact" },
//   ];

//   return (
//     <nav className="fixed w-full top-0 z-50 bg-slate-950 border-b border-slate-800">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
          
//           {/* Logo */}
//           <a href="/" className="flex items-center">
//             <img src="/assets/images/logo.jpg" alt="Logo" className="h-12 w-12 mr-2" />
//           </a>

//           {/* Desktop Links - Hidden on Mobile */}
//           <div className="hidden md:flex space-x-8">
//             {navLinks.map((link) => (
//               <a key={link.path}
//                 href={link.path}
//                 className="text-slate-300 hover:text-purple-400 transition-colors duration-200"
//               >
//                 {link.name}
//               </a>
//             ))}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-slate-300 focus:outline-none"
//           >
//             {/* Simple SVG Icons for Menu/Close */}
//             {isOpen ? (
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             ) : (
//               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu - Shows/Hides based on isOpen state */}
//       <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-slate-900 border-t border-slate-800`}>
//         <div className="px-2 pt-2 pb-3 space-y-1">
//           {navLinks.map((link) => (
//             <a
//               key={link.path}
//               href={link.path}
//               className="block px-3 py-4 text-slate-300 hover:text-purple-400 hover:bg-slate-800 rounded-md"
//               onClick={() => setIsOpen(false)}
//             >
//               {link.name}
//             </a>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }




