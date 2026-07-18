"use client";

import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Footer          from "./components/Footer";
import Navbar          from "./components/Navbar";
import FloatingButtons from "./components/FloatingButtons";
import { usePathname } from "next/navigation";
import { Toaster }     from "sonner";
import { ThemeProvider } from "./context/ThemeContext";

// Runs before first paint so the correct theme (saved choice, or "dark"
// by default) is applied immediately — no flash of the wrong theme.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("site-theme");
    var theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function RootLayout({ children }) {
  const pathname    = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {!isAdminPage && <Navbar />}

          {children}

          {!isAdminPage && <Footer />}
          {!isAdminPage && <FloatingButtons />}

          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
