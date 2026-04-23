import { 
  FiArrowRight, 
  FiCode, 
  FiSmartphone, 
  FiServer, 
  FiGlobe,
  FiShoppingCart 
} from "react-icons/fi";
import { 
  FaBrush,
  FaStar 
} from "react-icons/fa";
import { BsStars } from "react-icons/bs";

export default function Services() {
  const services = [
    {
      icon: FiCode,
      title: "Full Stack Development",
      description: "End-to-end web solutions using React, Next.js, Node.js, Express, and MongoDB. From concept to deployment.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: FiSmartphone,
      title: "Responsive Design",
      description: "Mobile-first designs that work flawlessly across all devices and screen sizes with pixel-perfect precision.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FiServer,
      title: "Backend Development",
      description: "Robust APIs, databases, authentication, and server-side logic with modern tech stack.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: FiGlobe,
      title: "Web Applications",
      description: "Scalable, feature-rich web apps with complex functionality and seamless user experiences.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: FaBrush,  // ✅ Fixed: Using FaBrush from react-icons/fa
      title: "UI/UX Design",
      description: "Beautiful, intuitive interfaces crafted with user psychology and modern design principles.",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: FiShoppingCart,
      title: "E-Commerce Solutions",
      description: "Complete online stores with payment gateways, inventory management, and admin dashboards.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  // Rest of your component remains exactly the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent)]" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-slide-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 mb-8">
            <BsStars className="text-xl text-purple-400" />
            <span className="text-lg font-semibold text-purple-100">Services</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight mb-6">
            What I Offer
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Premium development services crafted with modern technologies and exceptional user experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group relative bg-slate-900/70 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/90 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden animate-slide-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 mx-auto mb-6`}>
                    <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>
                  <a
                    href="/contact"
                    className="group/link inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-slate-300 hover:text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border border-slate-800/50 hover:border-purple-500/50 hover:scale-105"
                  >
                    <span>Get Started</span>
                    <FiArrowRight className="text-sm group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-32 animate-slide-in-up delay-600">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Transform Your Idea?
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Let's build something extraordinary together. Your vision, my expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/contact"
                className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold rounded-3xl hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 flex items-center gap-3 text-lg"
              >
                <span>Start Your Project</span>
                <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
              </a>
              <a
                href="/projects"
                className="px-10 py-4 bg-slate-800/50 backdrop-blur-sm text-white font-semibold rounded-3xl hover:bg-slate-700 hover:shadow-lg hover:shadow-purple-500/25 border border-slate-800/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                View My Work
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}