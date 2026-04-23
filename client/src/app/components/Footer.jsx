import { 
  BiLogoGithub, 
  BiLogoLinkedin, 
  BiMailSend,
  BiHome,
  BiUser,
  BiBook,
  BiMessageRounded
} from "react-icons/bi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-300 border-t-2 border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">BB</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Bhaskar Portfolio
              </h2>
            </div>
            <p className="text-sm leading-relaxed opacity-80 max-w-md">
              Crafting exceptional digital experiences with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <BiHome className="text-purple-400" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home", icon: BiHome },
                { href: "/about", label: "About", icon: BiUser },
                { href: "/projects", label: "Projects", icon: BiBook },
                { href: "/contact", label: "Contact", icon: BiMessageRounded }
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a 
                    href={href}
                    className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 hover:text-purple-300 transition-all duration-300 border border-transparent hover:border-slate-700/50"
                  >
                    <Icon className="text-lg group-hover:text-purple-400 transition-colors" />
                    <span className="font-medium">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <span>Connect</span>
            </h3>
            <div className="space-y-3 mb-6">
              <p className="text-sm opacity-80 mb-3">Let's connect and create something amazing together!</p>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    href: "https://github.com/Bhaskar787",
                    icon: BiLogoGithub,
                    label: "GitHub"
                  },
                  {
                    href: "https://www.linkedin.com/in/bhaskar-budha-1a58b83b6",
                    icon: BiLogoLinkedin,
                    label: "LinkedIn"
                  },
                  {
                    href: "mailto:budhabhaskar11@gmail.com?subject=Hello%20Bhaskar&body=I%20want%20to%20contact%20you.",
                    icon: BiMailSend,
                    label: "Email"
                  }
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 bg-slate-800/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-xl rounded-xl flex items-center justify-center transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50 hover:scale-105"
                    aria-label={label}
                  >
                    <Icon className="text-xl group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Stay Updated</h3>
            <p className="text-sm opacity-80 mb-4">Get the latest updates on new projects and articles.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-xs opacity-60 mt-2">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/30 pt-8 pb-4 flex flex-col md:flex-row justify-center items-center text-sm opacity-75">
          <p>
            &copy; {new Date().getFullYear()} Bhaskar Budha. 
            <span className="hidden md:inline mx-2">•</span>
            <span className="md:hidden block my-1">•</span>
            All rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
}