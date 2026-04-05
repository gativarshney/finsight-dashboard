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
    <header className="h-20 px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Mobile Logo (visible on mobile only, hidden on md and above) */}
        <div className="md:hidden flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500">
            FinSight
          </span>
        </div>
        
        {/* Page Title (hidden on mobile, visible on md and above) */}
        <h1 className="hidden md:block text-2xl font-bold text-slate-900 dark:text-white capitalize">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium border border-slate-200 dark:border-slate-700">
          {role === "Admin" ? (
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          ) : (
            <User className="h-4 w-4 text-emerald-500" />
          )}
          <span className="text-slate-700 dark:text-slate-300">{role}</span>
        </div>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
        
        <ThemeToggle />
      </div>
    </header>
  );
}
