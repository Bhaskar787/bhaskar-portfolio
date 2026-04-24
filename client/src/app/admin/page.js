"use client";
import { useState, useEffect } from "react";
import { IoSchool } from "react-icons/io5";
import { FiBriefcase, FiMail, FiArrowRight, FiUser, FiCode, FiAward } from "react-icons/fi";
import Link from "next/link";
import { FaTools } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    projectCount: 0, 
    contactCount: 0,
    experienceCount: 0, 
    educationCount: 0, 
    skillCount: 0, 
    aboutCount: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: stats.projectCount,
      icon: <FiBriefcase className="text-blue-400 w-10 h-10" />,
      bg: "from-blue-500/10 to-blue-600/10 border-blue-500/30",
      link: "/admin/project",
      color: "text-blue-400"
    },
    {
      title: "Contacts",
      value: stats.contactCount,
      icon: <FiMail className="text-emerald-400 w-10 h-10" />,
      bg: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/30",
      link: "/admin/contact",
      color: "text-emerald-400"
    },
    {
      title: "Experience",
      value: stats.experienceCount,
      icon: <MdHomeWork className="text-purple-400 w-10 h-10" />,
      bg: "from-purple-500/10 to-purple-600/10 border-purple-500/30",
      link: "/admin/experience",
      color: "text-purple-400"
    },
    {
      title: "Education",
      value: stats.educationCount,
      icon: <IoSchool className="text-indigo-400 w-10 h-10" />,
      bg: "from-indigo-500/10 to-indigo-600/10 border-indigo-500/30",
      link: "/admin/education",
      color: "text-indigo-400"
    },
    {
      title: "Skills",
      value: stats.skillCount,
      icon: <FaTools className="text-orange-400 w-10 h-10" />,
      bg: "from-orange-500/10 to-orange-600/10 border-orange-500/30",
      link: "/admin/skills",
      color: "text-orange-400"
    },
    {
      title: "About",
      value: stats.aboutCount,
      icon: <FaUserLarge className="text-pink-400 w-10 h-10" />,
      bg: "from-pink-500/10 to-pink-600/10 border-pink-500/30",
      link: "/admin/about",
      color: "text-pink-400"
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-slide-in-up">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BsStars className="text-purple-400 w-8 h-8" />
            <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-md">
            Welcome back! Here's what's happening with your portfolio.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-up delay-200">
        {statCards.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            className="group relative bg-slate-900/70 backdrop-blur-sm p-8 rounded-3xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm`} />
            
            {/* Content */}
            <div className="relative z-10 flex items-center justify-between h-full">
              <div className="space-y-3">
                <div className={`p-4 rounded-2xl bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
                    {card.title}
                  </p>
                  <p className={`text-3xl lg:text-4xl font-black ${card.color} mt-1`}>
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
              </div>
              <FiArrowRight className={`w-6 h-6 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300 ${card.color}`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/70 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-400">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Jump straight to what you need to manage
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Add Project", href: "/admin/project/create", icon: FiBriefcase },
            { label: "View Messages", href: "/admin/contact", icon: FiMail },
            { label: "Manage Experience", href: "/admin/experience", icon: MdHomeWork },
            { label: "Update Education", href: "/admin/education", icon: IoSchool },
            { label: "Edit Skills", href: "/admin/skills", icon: FaTools },
            { label: "Update About", href: "/admin/about", icon: FiUser },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group relative p-6 lg:p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-purple-500/75 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-400 flex items-center gap-4 text-left"
            >
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                <action.icon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">
                  {action.label}
                </p>
              </div>
              <FiArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300 ml-auto" />
            </Link>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 animate-pulse">
              <div className="w-16 h-16 bg-slate-700 rounded-2xl mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded w-24 mb-2" />
                <div className="h-8 bg-slate-700 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}