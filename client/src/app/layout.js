import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import SiteChrome from "./components/SiteChrome";
import connectDB from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function generateMetadata() {
  const initialSettings = await getInitialSettings();
  const title = initialSettings?.siteName ? `${initialSettings.siteName} | Full-Stack Developer` : "Bhaskar Budha | Full-Stack Developer";
  const faviconUrl = initialSettings?.favicon || initialSettings?.logo || "/favicon.ico";

  return {
    title,
    description: "Portfolio of Bhaskar Budha - Full-Stack Developer & UI Engineer",
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: [faviconUrl],
      apple: [faviconUrl],
    },
  };
}

// Runs before first paint so the correct theme is applied synchronously
// by the browser parser before any CSS styles or elements are rendered.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("site-theme");var t=s==="light"||s==="dark"?s:"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

async function getInitialSettings() {
  try {
    await connectDB();
    const doc = await SiteSettings.findOne().sort({ createdAt: -1 }).lean();
    if (doc) {
      return JSON.parse(JSON.stringify(doc));
    }
  } catch (err) {
    console.error("SSR getInitialSettings error:", err);
  }
  return null;
}

export default async function RootLayout({ children }) {
  const initialSettings = await getInitialSettings();
  const faviconUrl = initialSettings?.favicon || initialSettings?.logo || "/favicon.ico";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconUrl} sizes="any" />
        <link rel="apple-touch-icon" href={faviconUrl} />
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <SiteChrome initialSettings={initialSettings}>{children}</SiteChrome>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}