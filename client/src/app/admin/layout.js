"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode"; 

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

  // --- LOGOUT HANDLER ---
  const handleLogout = (e) => {
    e.preventDefault();
    // 1. Remove the token from cookies
    Cookies.remove("admin_token"); 
    // 2. Redirect to login page
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0
      `}>
        <div className="p-6 text-sm font-bold border-b border-slate-800 flex justify-between items-center">
          <span>Bhaskar Portfolio Admin</span>
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <nav className="flex-1 p-4 space-y-2">
  <a href="/admin" className={`block p-3 rounded ${pathname === '/admin' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>Dashboard</a>
  <a href="/admin/project" className={`block p-3 rounded ${pathname === '/admin/project' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>Projects</a>
  <a href="/admin/experience" className={`block p-3 rounded ${pathname === '/admin/experience' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>Experience</a>
  <a href="/admin/education" className={`block p-3 rounded ${pathname === '/admin/education' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>Education</a>
  <a href="/admin/skills" className={`block p-3 rounded ${pathname === '/admin/skills' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>Skills</a>
  <a href="/admin/about" className={`block p-3 rounded ${pathname === '/admin/about' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>About</a>
  <a href="/admin/contact" className={`block p-3 rounded ${pathname === '/admin/contact' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>Contacts</a>
</nav>


          
        </nav>

        {/* Updated Logout Link to use handler */}
        <nav className="p-4">
          <button 
            onClick={handleLogout}
            className="w-full text-left block p-3 hover:bg-red-500 rounded transition-colors"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2 text-gray-600 md:hidden hover:bg-gray-100 rounded"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
              System Overview
            </h2>
          </div>
          
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-sm text-gray-500 font-medium text-right">
              Welcome, <br />
              <span className="text-slate-900 font-bold">{adminName}</span>
            </span>
            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 border border-slate-300 uppercase">
              {adminName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}