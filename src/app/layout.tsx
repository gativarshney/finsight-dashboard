import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased selection:bg-indigo-500/30`}>
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
                className: 'dark:bg-slate-800 dark:text-white border dark:border-slate-700' 
              }} 
            />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
