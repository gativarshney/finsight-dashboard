"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useAppContext } from "@/context/AppContext";
import { getMonthlyTotals, formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";

function toTooltipNumber(value: ValueType | undefined) {
  if (Array.isArray(value)) return Number(value[0] ?? 0);
  return Number(value ?? 0);
}

export function BalanceTrendChart() {
  const { transactions } = useAppContext();
  const { resolvedTheme } = useTheme();

  const data = useMemo(() => getMonthlyTotals(transactions), [transactions]);

  const isDark = resolvedTheme === "dark";
  const strokeColor = "#3B82F6";
  const gridColor = isDark ? "#1E2D45" : "#E2E8F0";
  const textColor = "#64748B";
  const tooltipBg = isDark ? "#0D1421" : "#ffffff";
  const tooltipBorder = isDark ? "#1E2D45" : "#E2E8F0";

  if (data.length === 0) {
    return (
      <div className="app-panel flex h-96 flex-col items-center justify-center p-6">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
            <Activity className="h-8 w-8" />
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">No balance trend yet</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add transaction history to generate a rolling balance view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-panel col-span-1 flex h-[400px] flex-col p-6 lg:col-span-2">
      <div className="mb-6">
        <span className="section-kicker">Performance</span>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Balance Trend</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.05} />
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
                borderRadius: "1rem",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
                color: isDark ? "#f8fafc" : "#0f172a"
              }}
              formatter={(value: ValueType | undefined) => [formatCurrency(toTooltipNumber(value)), "Balance"]}
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
