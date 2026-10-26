"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingButtons from "./FloatingButtons";
import CloudCursorGSAP from "./CloudCursorGSAP";
import DynamicFavicon from "./DynamicFavicon";

export default function SiteChrome({ children, initialSettings = null }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      <DynamicFavicon initialFavicon={initialSettings?.favicon || initialSettings?.logo} />
      {!isAdminPage && <CloudCursorGSAP />}
      {!isAdminPage && <Navbar initialSettings={initialSettings} />}
      {children}
      {!isAdminPage && <Footer initialSettings={initialSettings} />}
      {!isAdminPage && <FloatingButtons />}
    </>
  );
}
