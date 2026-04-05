"use client";

import { Shield, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Role } from "@/types";

export function RoleSwitcher() {
  const { role, setRole } = useAppContext();
  const initials = role === "Admin" ? "AD" : "VW";

  return (
    <div className="mt-auto rounded-[1.75rem] border border-white/5 bg-white/70 p-3 shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:bg-[#0F1724]/90">
      <div className="flex items-center space-x-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white shadow-[0_10px_24px_rgba(59,130,246,0.28)]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">Workspace User</p>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
                {role === "Admin" ? (
                  <Shield className="h-3.5 w-3.5 text-blue-500" />
                ) : (
                  <User className="h-3.5 w-3.5 text-cyan-500" />
                )}
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="min-h-11 cursor-pointer appearance-none rounded-full border border-slate-200 bg-white/80 py-1 pl-7 pr-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-700 outline-none ring-0 transition focus:ring-2 focus:ring-blue-500 dark:border-[#22314A] dark:bg-[#111B2B] dark:text-slate-200"
              >
                <option value="Viewer" className="dark:bg-slate-800">Viewer</option>
                <option value="Admin" className="dark:bg-slate-800">Admin</option>
              </select>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Access level</p>
        </div>
      </div>
    </div>
  );
}
