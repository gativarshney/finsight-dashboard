"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAppContext } from "@/context/AppContext";
import { getMonthlyTotals, formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";

export function BalanceTrendChart() {
  const { transactions } = useAppContext();
  const { resolvedTheme } = useTheme();

  const data = useMemo(() => getMonthlyTotals(transactions), [transactions]);

  const isDark = resolvedTheme === "dark";
  const strokeColor = "#6366f1"; // Indigo-500
  const gridColor = isDark ? "#334155" : "#e2e8f0"; // slate-700 : slate-200
  const textColor = isDark ? "#94a3b8" : "#64748b"; // slate-400 : slate-500
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"; // slate-800 : white
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"; // slate-700 : slate-200

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-96 items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">No data available for trend chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-2 flex flex-col h-[400px]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Balance Trend</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 12 }} 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: isDark ? "#f8fafc" : "#0f172a"
              }}
              formatter={(value: number) => [formatCurrency(value), "Balance"]}
              itemStyle={{ color: strokeColor, fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
