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
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">Workspace User</p>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-500">
              {role}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Access level</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-500/5 p-1.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/5">
          {role === "Admin" ? (
            <Shield className="h-4 w-4 text-blue-500" />
          ) : (
            <User className="h-4 w-4 text-cyan-500" />
          )}
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full appearance-none bg-transparent pr-3 text-sm font-semibold text-[var(--text-primary)] outline-none cursor-pointer"
        >
          <option value="Viewer" className="dark:bg-slate-800">Viewer</option>
          <option value="Admin" className="dark:bg-slate-800">Admin</option>
        </select>
      </div>
    </div>
  );
}
