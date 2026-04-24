"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode";
import { FiBriefcase, FiMail, FiUser, FiCode, FiAward, FiBookOpen } from "react-icons/fi";
import { FaTools } from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  const isLoginPage = pathname === "/admin/login";
  const isRegisterPage = pathname === "/admin/register";

  // Fetch admin name from token on load
  useEffect(() => {
    if (!isLoginPage && !isRegisterPage) {
      const token = Cookies.get("admin_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setAdminName(decoded.name || "Admin");
        } catch (error) {
          console.error("Token decode error:", error);
        }
      }
    }
  }, [isLoginPage, isRegisterPage]);

  if (isLoginPage || isRegisterPage) return <>{children}</>;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Logout handler
  const handleLogout = () => {
    Cookies.remove("admin_token");
    toast.success("Logged out successfully!");
    router.push("/admin/login");
    router.refresh();
  };

  // Navigation items with icons
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: FiBriefcase },
    { href: "/admin/project", label: "Projects", icon: FiCode },
    { href: "/admin/experience", label: "Experience", icon: FiAward },
    { href: "/admin/education", label: "Education", icon: FiBookOpen },
    { href: "/admin/skills", label: "Skills", icon: FaTools },
    { href: "/admin/about", label: "About", icon: FiUser },
    { href: "/admin/contact", label: "Contacts", icon: FiMail },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.08),transparent),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />
      
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - NO SCROLL */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0 shadow-2xl shadow-purple-500/10" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:shadow-xl md:shadow-purple-500/5
        h-screen overflow-hidden
      `}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <FiBriefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Portfolio Admin
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">v1.0</p>
            </div>
          </div>
          <button className="md:hidden p-2 hover:bg-slate-800/50 rounded-xl transition-colors" onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation - NO SCROLL */}
        <nav className="flex-1 p-4 lg:p-6 space-y-1 flex flex-col">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-4 p-4 lg:p-5 rounded-2xl transition-all duration-300 font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/20 border border-transparent hover:border-purple-500/50 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/50 shadow-lg shadow-purple-500/25' 
                    : ''
                }`}
              >
                <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm transition-all group-hover:scale-110 ${isActive ? 'bg-white/20 shadow-lg shadow-purple-500/25' : ''}`}>
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-400'}`} />
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile & Logout - SIMPLIFIED */}
        <div className="p-4 lg:p-6 border-t border-slate-800/50 space-y-3 flex-shrink-0">
          {/* Admin Name Only */}
          <div className="p-4 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold uppercase text-sm">
                  {adminName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white text-sm truncate">{adminName}</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-100 transition-all duration-300 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 font-medium"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}

<header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg sticky top-0 z-30">
  <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
    <div className="flex items-center gap-4 flex-shrink-0">
      {/* FIXED: Mobile Menu Button - Always Visible */}
      <button 
        onClick={toggleSidebar} 
        className="p-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-2xl transition-all duration-300 shadow-lg z-40 relative md:hidden flex-shrink-0"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      {/* Breadcrumb */}
      <div className="hidden md:block min-w-0 flex-1">
        <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent truncate">
          {(() => {
            const pageName = pathname.split('/').pop()?.replace(/([A-Z])/g, ' $1') || 'Dashboard';
            return pageName.charAt(0).toUpperCase() + pageName.slice(1);
          })()}
        </h2>
      </div>
    </div>
    
    {/* Profile - Fixed positioning */}
    <div className="hidden lg:flex items-center gap-3 flex-shrink-0 p-2 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all group">
      {/* Dynamic Avatar */}
      <div 
        className="flex items-center justify-center shadow-lg rounded-2xl font-bold uppercase text-white transition-all"
        style={{
          width: adminName.length > 8 ? '44px' : adminName.length > 5 ? '40px' : '36px',
          height: adminName.length > 8 ? '44px' : adminName.length > 5 ? '40px' : '36px',
          fontSize: adminName.length > 8 ? '0.75rem' : adminName.length > 5 ? '0.875rem' : '1rem',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)'
        }}
      >
        {adminName.charAt(0)}
      </div>
      
      <div className="min-w-0 flex flex-col items-end">
        <p className="font-semibold text-white text-sm truncate max-w-32 group-hover:max-w-none transition-all" title={adminName}>
          {adminName}
        </p>
        <p className="text-xs text-slate-400">Administrator</p>
      </div>
    </div>
  </div>
</header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/50 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
