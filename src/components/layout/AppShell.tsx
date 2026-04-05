"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAppContext } from "@/context/AppContext";
import { PageSkeleton } from "./PageSkeleton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading } = useAppContext();

  return (
    <div className="finsight-dot-grid flex h-screen overflow-hidden font-sans text-[var(--text-primary)]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(59,130,246,0.03),transparent_18%,transparent_100%)] dark:bg-[linear-gradient(180deg,rgba(59,130,246,0.04),transparent_16%,transparent_100%)]" />
          <div className="relative">
            {isLoading ? <PageSkeleton /> : children}
          </div>
        </main>
      </div>
    </div>
  );
}
