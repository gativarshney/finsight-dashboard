"use client";

import { Shield, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Role } from "@/types";

export function RoleSwitcher() {
  const { role, setRole } = useAppContext();

  return (
    <div className="flex items-center space-x-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mt-auto">
      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
        {role === "Admin" ? (
          <Shield className="h-5 w-5 text-indigo-500" />
        ) : (
          <User className="h-5 w-5 text-emerald-500" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Logged in as</p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="text-sm font-semibold bg-transparent outline-none cursor-pointer w-full text-slate-900 dark:text-slate-100 appearance-none"
        >
          <option value="Viewer" className="dark:bg-slate-800">Viewer</option>
          <option value="Admin" className="dark:bg-slate-800">Admin</option>
        </select>
      </div>
    </div>
  );
}
