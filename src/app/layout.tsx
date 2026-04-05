import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "FinSight Dashboard",
  description: "A modern, production-quality finance dashboard for visualizing Mock Financial Data.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-blue-500/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppProvider>
            <AppShell>{children}</AppShell>
            <Toaster 
              position="top-right" 
              toastOptions={{ 
                className: "border border-slate-200 bg-white text-slate-900 shadow-lg dark:border-[#1E2D45] dark:bg-[#0D1421] dark:text-[#F0F4FF]" 
              }} 
            />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
