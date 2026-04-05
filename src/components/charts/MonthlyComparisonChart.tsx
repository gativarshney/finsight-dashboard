"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAppContext } from "@/context/AppContext";
import { getMonthlyTotals, formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";

export function MonthlyComparisonChart() {
  const { transactions } = useAppContext();
  const { resolvedTheme } = useTheme();

  const data = useMemo(() => getMonthlyTotals(transactions), [transactions]);

  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#334155" : "#e2e8f0"; // slate-700 : slate-200
  const textColor = isDark ? "#94a3b8" : "#64748b"; // slate-400 : slate-500
  const tooltipBg = isDark ? "#1e293b" : "#ffffff"; // slate-800 : white
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0"; // slate-700 : slate-200

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-[400px] items-center justify-center mt-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 self-start">Monthly Income vs Expenses</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-slate-500 dark:text-slate-400">No data available for chart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm mt-6 flex flex-col h-[450px]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Monthly Income vs Expenses</h3>
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
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                color: isDark ? "#f8fafc" : "#0f172a"
              }}
              cursor={{ fill: isDark ? "#334155" : "#f1f5f9" }}
              formatter={(value: any, name: any) => [
                formatCurrency(Number(value) || 0), 
                name === "income" ? "Income" : "Expenses"
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
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#f43f5e" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
