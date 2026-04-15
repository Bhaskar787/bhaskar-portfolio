"use client";


import "./globals.css";

import "bootstrap-icons/font/bootstrap-icons.css";


import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {

  const pathname = usePathname()

  const isAdminPage = pathname.startsWith("/admin")
  


  return (
    <html lang="en">
      <body>

        {!isAdminPage && <Navbar />}

        {children}

        {!isAdminPage && <Footer/>}

        

      </body>
    </html>
  );
}