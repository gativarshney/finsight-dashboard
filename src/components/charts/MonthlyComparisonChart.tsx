"use client";

import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useAppContext } from "@/context/AppContext";
import { getMonthlyTotals, formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";

function toTooltipNumber(value: ValueType | undefined) {
  if (Array.isArray(value)) return Number(value[0] ?? 0);
  return Number(value ?? 0);
}

export function MonthlyComparisonChart() {
  const { transactions } = useAppContext();
  const { resolvedTheme } = useTheme();

  const data = useMemo(() => getMonthlyTotals(transactions), [transactions]);

  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#1E2D45" : "#E2E8F0";
  const textColor = "#64748B";
  const tooltipBg = isDark ? "#0D1421" : "#ffffff";
  const tooltipBorder = isDark ? "#1E2D45" : "#E2E8F0";

  if (data.length === 0) {
    return (
      <div className="app-panel mt-6 flex h-[400px] flex-col items-center justify-center p-6">
        <h3 className="mb-6 self-start text-lg font-semibold tracking-tight text-[var(--text-primary)]">Monthly Income vs Expenses</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
              <BarChart3 className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">No monthly comparison yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Income and expense bars will appear once monthly activity is available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-panel mt-6 flex h-[450px] flex-col p-6">
      <div className="mb-6">
        <span className="section-kicker">Cash Flow</span>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Monthly Income vs Expenses</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 13 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: textColor, fontSize: 13 }} 
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
              cursor={{ fill: isDark ? "#0F1724" : "#EFF6FF" }}
              formatter={(value: ValueType | undefined, name: NameType | undefined) => [
                formatCurrency(toTooltipNumber(value)), 
                String(name ?? "") === "Income" ? "Income" : "Expenses"
              ]}
              labelStyle={{ color: textColor, fontWeight: 500, marginBottom: "8px" }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '14px', color: textColor, paddingBottom: '20px' }}
            />
            <Bar 
              dataKey="income" 
              name="Income" 
              fill="#06B6D4" 
              radius={[8, 8, 0, 0]} 
              barSize={32}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#EF4444" 
              radius={[8, 8, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
