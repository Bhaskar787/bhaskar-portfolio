// "use client"
// import { usePathname } from "next/navigation";

// // app/admin/layout.js
// export default function AdminLayout({ children }) {
//     const pathname = usePathname();
//   const isLoginPage = pathname === "/admin/login";
//   const isRegisterPage = pathname === "/admin/register"

//   // If it's the login page, don't show the sidebar/header
//   if (isLoginPage) return <>{children}</>;

//   // If it's the register page, don't show the sidebar/header
//   if(isRegisterPage) return <>{children}</>
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-slate-900 text-white flex flex-col">
//         <div className="p-6 text-sm font-bold border-b border-slate-800">
//           Bhaskar Portfolio AdminPanel
//         </div>
//         <nav className="flex-1 p-4 space-y-2">
//           <a href="/admin" className="block p-3 hover:bg-slate-800 rounded">Dashboard</a>
//            <a href="/admin/project" className="block p-3 hover:bg-slate-800 rounded">Projects</a>
//             <a href="/admin/contact" className="block p-3 hover:bg-slate-800 rounded">Contacts</a>
         
//         </nav>
//         <nav className=" p-4 space-y-2"> <a href="/admin/login" className="block p-3 hover:bg-red-500 hover:text-shadow-white rounded">Logout</a>
//         </nav>
       
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="h-16 bg-white border-b flex items-center justify-between px-8">
//           <h2 className="text-xl font-semibold text-gray-800">System Overview</h2>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-500">Welcome To Admin Dahboard. </span>
            
//           </div>
//         </header>

//         {/* Dynamic Content */}
//         <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Optional: Install lucide-react or use SVG

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";
  const isRegisterPage = pathname === "/admin/register";

  if (isLoginPage || isRegisterPage) return <>{children}</>;

  // added toggle menu asidebar open onclik menu in mobile mobile 
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
     {/* side bar hidden on mobile phone open on toggle menu*/}
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
          {/* Close button for mobile */}
          <button className="md:hidden" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin" className="block p-3 hover:bg-slate-800 rounded">Dashboard</a>
          <a href="/admin/project" className="block p-3 hover:bg-slate-800 rounded">Projects</a>
          <a href="/admin/contact" className="block p-3 hover:bg-slate-800 rounded">Contacts</a>
        </nav>

        <nav className="p-4">
          <a href="/admin/login" className="block p-3 hover:bg-red-500 rounded">Logout</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
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
          
          <div className="hidden sm:block">
            <span className="text-sm text-gray-500">Welcome To Admin Dashboard</span>
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