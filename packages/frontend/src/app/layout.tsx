import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@dashboardpack/core/providers/theme-provider";
import { LocaleProvider } from "@dashboardpack/core/lib/i18n/locale-context";
import { Toaster } from "@dashboardpack/core/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://switchyardcapital.com.au"),
  title: {
    default: "SwitchYard Capital — Premium Admin Dashboard Template",
    template: "%s | SwitchYard Capital",
  },
  description:
    "Premium admin dashboard with Next.js 15, React 19, TypeScript, and Tailwind CSS. 80+ pages, 9 dashboards, e-commerce, auth, dark mode, RTL, i18n.",
  keywords: [
    "admin dashboard",
    "nextjs template",
    "react admin",
    "tailwindcss dashboard",
    "admin panel",
    "saas template",
  ],
  authors: [{ name: "DashboardPack", url: "https://dashboardpack.com" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "SwitchYard Capital — Premium Admin Dashboard Template",
    description:
      "80+ pages, 9 dashboards, e-commerce, auth, dark mode, RTL, i18n. Built with Next.js 15, React 19, and Tailwind CSS.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwitchYard Capital — Premium Admin Dashboard Template",
    description:
      "80+ pages, 9 dashboards, e-commerce, auth, dark mode, RTL, i18n.",
    images: ["/og-image.png"],
  },
};

const foucScript = `(function(){try{var p={"switchyard-teal":"#00897b","ocean-blue":"#4680ff","royal-purple":"#7c4dff","rose-pink":"#e91e63","crimson-red":"#dc2626","vibrant-orange":"#ff9800","golden-yellow":"#ffd54f","forest-green":"#4caf50","aqua-cyan":"#00bcd4","dark":"#212529","navy":"#34495e"};var r=document.documentElement;var c=localStorage.getItem("switchyard-color-preset")||"switchyard-teal";if(p[c]){var v=p[c];var s=r.style;s.setProperty("--primary",v);s.setProperty("--primary-foreground","#ffffff");s.setProperty("--sidebar-primary",v);s.setProperty("--sidebar-primary-foreground","#ffffff");s.setProperty("--sidebar-ring",v);s.setProperty("--chart-1",v);s.setProperty("--ring",v);var h=parseInt(v.slice(1,3),16),g=parseInt(v.slice(3,5),16),b=parseInt(v.slice(5,7),16);s.setProperty("--accent","rgba("+h+","+g+","+b+",0.04)")}}catch(e){}})();(function(){try{var r=document.documentElement;var l=localStorage.getItem("switchyard-layout");if(l==="topnav"){r.classList.add("layout-topnav")}else{r.classList.add("layout-sidebar")}}catch(e){document.documentElement.classList.add("layout-sidebar")}})();(function(){try{var r=document.documentElement;var b=localStorage.getItem("switchyard-container");if(b==="boxed"){r.classList.add("container-boxed")}else{r.classList.add("container-fluid")}}catch(e){document.documentElement.classList.add("container-fluid")}})();(function(){try{var r=document.documentElement;var d=localStorage.getItem("switchyard-direction");if(d==="rtl"){r.dir="rtl";r.classList.add("dir-rtl")}else{r.dir="ltr";r.classList.add("dir-ltr")}}catch(e){document.documentElement.dir="ltr";document.documentElement.classList.add("dir-ltr")}})();(function(){try{var r=document.documentElement;var s=localStorage.getItem("switchyard-sidebar-theme")||"dark";r.classList.add("sidebar-theme-"+s)}catch(e){document.documentElement.classList.add("sidebar-theme-dark")}})();(function(){try{var c=localStorage.getItem("switchyard-sidebar-captions");if(c==="hide"){document.documentElement.classList.add("sidebar-captions-hide")}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: foucScript }} />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="system" storageKey="switchyard-theme">
          <LocaleProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none"
            >
              Skip to content
            </a>
            {children}
            <Toaster richColors closeButton />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
