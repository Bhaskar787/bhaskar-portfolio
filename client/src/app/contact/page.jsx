"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { 
  FiMail, 
  FiPhone, 
  FiGithub, 
  FiLinkedin, 
  FiArrowRight,
  FiLoader,
  FiSend 
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success("Message sent successfully! I'll be right back to you soon! 🎉")
        setFormData({ name: "", email: "", phone: "", message: "" })
      } else {
        const data = await res.json()
        setStatus(`Error: ${data.error || "Failed to send"}`)
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 xl:py-32">
        
        {/* Hero Section - Fully Responsive */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 xl:mb-24 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-emerald-500/30 mb-6 sm:mb-8 mx-auto max-w-max">
            <BsStars className="text-lg sm:text-xl text-emerald-400" />
            <span className="text-base sm:text-lg font-semibold text-emerald-100 leading-tight">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight mb-4 sm:mb-6 lg:mb-8 tracking-tight">
            Let's Talk Business
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Ready to bring your vision to life? Drop me a message and let's create something extraordinary together.
          </p>
        </div>

        {/* Contact Info & Form - Fully Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-start animate-slide-in-up delay-200">
          
          {/* Contact Info - Left Column */}
          <div className="animate-slide-in-left delay-300 space-y-6 sm:space-y-8 lg:space-y-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-8 sm:mb-10 lg:mb-12 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
              Reach Out
            </h2>
            
            {/* Contact Cards */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8 lg:mb-12">
              {[
                {
                  icon: FiMail,
                  label: "Email",
                  value: "budhabhaskar11@gmail.com",
                  href: "mailto:budhabhaskar11@gmail.com",
                  gradient: "from-emerald-500 to-teal-500"
                },
                {
                  icon: FiPhone,
                  label: "Phone",
                  value: "+977 9825630086",
                  href: "tel:+9779825630086",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: FiLinkedin,
                  label: "LinkedIn",
                  value: "Bhaskar Budha",
                  href: "https://www.linkedin.com/in/bhaskar-budha-1a58b83b6",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: FiGithub,
                  label: "GitHub",
                  value: "Bhaskar787",
                  href: "https://github.com/Bhaskar787",
                  gradient: "from-slate-500 to-slate-300"
                }
              ].map((contact, idx) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={contact.href.startsWith('http') ? '_blank' : '_self'}
                  rel={contact.href.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="group relative block w-full p-4 sm:p-6 lg:p-8 xl:p-10 bg-slate-900/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 hover:border-emerald-500/75 hover:bg-slate-900/90 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 hover:scale-[1.02] min-h-[80px] sm:min-h-[100px] animate-slide-in-up"
                  style={{ animationDelay: `${idx * 100 + 400}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${contact.gradient} opacity-0 group-hover:opacity-5 blur-xl rounded-2xl sm:rounded-3xl transition-all duration-500`} />
                  <div className="relative z-10 flex items-start gap-3 sm:gap-4 lg:gap-6 h-full">
                    <div className={`p-2 sm:p-3 lg:p-4 xl:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${contact.gradient} shadow-2xl group-hover:scale-110 transition-all duration-500 flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20`}>
                      <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
                    </div>
                    <div className="min-w-0 flex-1 py-1 sm:py-2">
                      <p className="text-slate-400 text-xs sm:text-sm lg:text-base font-medium uppercase tracking-wider mb-1 sm:mb-2 truncate">
                        {contact.label}
                      </p>
                      <p className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors break-words sm:break-all lg:break-normal leading-tight line-clamp-2 sm:line-clamp-1">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Links - Responsive */}
            <div className="pt-6 sm:pt-8 border-t border-slate-800/50">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-4 sm:mb-6">Or Connect Here</h3>
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-wrap">
                <a 
                  href="https://github.com/Bhaskar787" 
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-900 hover:bg-purple-600/20 border border-slate-800/50 hover:border-purple-500/75 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl hover:text-purple-400 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 flex-shrink-0 group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FiGithub />
                </a>
                <a 
                  href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" 
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-slate-900 hover:bg-blue-600/20 border border-slate-800/50 hover:border-blue-500/75 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl lg:text-2xl hover:text-blue-400 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 flex-shrink-0 group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FiLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Column */}
          <div className="animate-slide-in-right delay-300 w-full">
            <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8 lg:p-12 xl:p-14 rounded-2xl sm:rounded-3xl border border-slate-800/50 shadow-2xl hover:shadow-emerald-500/25 transition-all hover:border-emerald-500/50">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-4 lg:mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent leading-tight">
                Send Message
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 mb-8 sm:mb-10 lg:mb-12 leading-relaxed">
                Fill out the form and I'll respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-2 sm:mb-3 text-base sm:text-lg lg:text-xl">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 lg:p-6 xl:p-7 rounded-xl sm:rounded-2xl bg-slate-800/50 backdrop-blur-sm text-white border border-slate-700/50 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg placeholder-slate-500 shadow-inner hover:border-slate-600/75"
                    placeholder="Ram chaudhary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-2 sm:mb-3 text-base sm:text-lg lg:text-xl">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 lg:p-6 xl:p-7 rounded-xl sm:rounded-2xl bg-slate-800/50 backdrop-blur-sm text-white border border-slate-700/50 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg placeholder-slate-500 shadow-inner hover:border-slate-600/75"
                    placeholder="ram123@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-2 sm:mb-3 text-base sm:text-lg lg:text-xl">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 lg:p-6 xl:p-7 rounded-xl sm:rounded-2xl bg-slate-800/50 backdrop-blur-sm text-white border border-slate-700/50 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg placeholder-slate-500 shadow-inner hover:border-slate-600/75"
                    placeholder="+977 9827635522"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-2 sm:mb-3 text-base sm:text-lg lg:text-xl">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 sm:p-5 lg:p-6 xl:p-7 rounded-xl sm:rounded-2xl bg-slate-800/50 backdrop-blur-sm text-white border border-slate-700/50 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg placeholder-slate-500 resize-vertical shadow-inner hover:border-slate-600/75 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full px-6 sm:px-8 lg:px-10 xl:px-12 py-4 sm:py-5 lg:py-6 xl:py-7 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-sm sm:text-base lg:text-lg xl:text-xl rounded-xl sm:rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 border border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wider font-black shadow-emerald-500/25 ${loading ? 'animate-pulse' : ''}`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm lg:text-base">Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      <span className="text-xs sm:text-sm lg:text-base">Send Message</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl sm:rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
                </button>

                {/* Status */}
                {status && (
                  <div className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl lg:rounded-3xl text-center text-sm sm:text-base lg:text-lg font-semibold shadow-lg transition-all ${status.includes("Error") ? "bg-red-500/20 border border-red-500/50 text-red-300" : "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"}`}>
                    {status}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Final CTA - Responsive */}
        <div className="text-center mt-16 sm:mt-20 lg:mt-24 animate-slide-in-up delay-600">
          <a
            href="/projects"
            className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-slate-900/50 backdrop-blur-sm text-white font-bold rounded-xl sm:rounded-3xl hover:bg-slate-800 hover:shadow-lg hover:shadow-purple-500/25 border border-slate-800/50 hover:border-purple-500/50 transition-all duration-400 hover:scale-105 text-sm sm:text-base lg:text-lg shadow-xl"
          >
            <span>Or Browse My Work</span>
            <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}