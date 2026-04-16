"use client";
import { useState, useEffect } from "react";
import { IoSchool } from "react-icons/io5";
import { FiBriefcase, FiMail, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { FaTools } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";
import { FaUserLarge } from "react-icons/fa6";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projectCount: 0, contactCount: 0,experienceCount:0, educationCount:0, skillCount:0, aboutCount:0 });
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
      title: "Total Projects",
      value: stats.projectCount,
      icon: <FiBriefcase className="text-blue-600" />,
      bg: "bg-blue-50",
      link: "/admin/project",
    },
    {
      title: "Contact Inquiries",
      value: stats.contactCount,
      icon: <FiMail className="text-purple-600" />,
      bg: "bg-purple-50",
      link: "/admin/contact",
    },

     {
      title: "Total Experience ",
      value: stats.experienceCount,
      icon: <MdHomeWork className="text-purple-600"/>,
      bg: "bg-purple-50",
      link: "/admin/experience",
    },
     {
      title: "Education",
      value: stats.educationCount,
      icon:<IoSchool className="text-purple-600" />,
      bg: "bg-purple-50",
      link: "/admin/education",
    },
     {
      title: "Skill Manage",
      value: stats.skillCount,
      icon: <FaTools className="text-purple-600"/>,
      bg: "bg-purple-50",
      link: "/admin/skills",
    },

    {
      title: "Admin About",
      value: stats.aboutCount,
      icon: <FaUserLarge className="text-purple-600"/>,
      bg: "bg-purple-50",
      link: "/admin/about",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here is what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`${card.bg} p-4 rounded-xl text-2xl`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : card.value}
                </h3>
              </div>
            </div>
            <Link
              href={card.link}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <FiArrowRight size={24} />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm ">
        <h2 className="text-lg text-center font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex  justify-center flex-wrap gap-4 py-3">
          <Link
            href="/admin/project"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
          >
            Add New Project
          </Link>
          <Link
            href="/admin/contact"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
          >
            Check Messages
          </Link>


           <Link
            href="/admin/experience"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
          >
            Check Experience
          </Link>

           <Link
            href="/admin/education"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
          >
            Check Education
          </Link>

           <Link
            href="/admin/about"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
          >
            Manage About
          </Link>

          <Link
            href="/admin/skill"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium"
          >
            Check Skills
          </Link>
        </div>
      </div>
    </div>
  );
}