"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleSwitcher } from "./RoleSwitcher";
import { useRef, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/insights", label: "Insights", icon: Lightbulb },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar on click outside for mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden dark:bg-slate-900/80" />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out flex flex-col px-5 py-6 border-r backdrop-blur-xl bg-[var(--sidebar)] border-[color:var(--sidebar-border)]",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center space-x-3 mb-10">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 shadow-[0_12px_28px_rgba(59,130,246,0.35)]">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            FinSight
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all",
                  isActive
                    ? "text-[var(--text-primary)]"
                    : "text-slate-500 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <span className={cn(
                  "absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-transparent transition-colors",
                  isActive && "bg-blue-500"
                )} />
                <span className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5",
                  isActive
                    ? "bg-blue-500/15 text-blue-500"
                    : "bg-slate-900/5 text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-500 dark:bg-white/5"
                )}>
                  <item.icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pointer-events-none mt-6 h-24 rounded-t-[2rem] bg-gradient-to-t from-blue-500/10 via-blue-500/5 to-transparent" />
        <RoleSwitcher />
      </aside>
    </>
  );
}
