"use client";

import { Menu, ShieldCheck, User, Activity } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const pathname = usePathname();
  const { role } = useAppContext();
  
  const title = pathname === "/transactions" 
    ? "Transactions" 
    : pathname === "/insights" 
      ? "Insights" 
      : "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[color:var(--sidebar-border)] bg-[color:color-mix(in_srgb,var(--sidebar)_82%,transparent)] px-6 backdrop-blur-xl lg:px-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="button-glow lg:hidden rounded-xl border border-slate-200/80 bg-white/70 p-2 text-slate-500 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:hover:bg-white/[0.06]"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Mobile Logo (visible on mobile only, hidden on md and above) */}
        <div className="md:hidden flex items-center space-x-2">
          <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2 shadow-[0_10px_24px_rgba(59,130,246,0.28)]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
            FinSight
          </span>
        </div>
        
        {/* Page Title (hidden on mobile, visible on md and above) */}
        <div className="hidden md:flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_18px_rgba(59,130,246,0.85)]" />
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] capitalize">{title}</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-[var(--text-primary)]">
          {role === "Admin" ? (
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          ) : (
            <User className="h-4 w-4 text-cyan-500" />
          )}
          <span>{role}</span>
        </div>
        
        <div className="hidden h-6 w-px bg-[color:var(--sidebar-border)] sm:block" />
        
        <ThemeToggle />
      </div>
    </header>
  );
}
