"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAppContext } from "@/context/AppContext";
import { groupByCategory, formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";
import { subMonths, isAfter } from "date-fns";

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#f59e0b", // amber
  "Transport": "#3b82f6", // blue
  "Shopping": "#ec4899", // pink
  "Entertainment": "#8b5cf6", // violet
  "Health": "#10b981", // emerald
  "Utilities": "#06b6d4", // cyan
  "Rent": "#6366f1", // indigo
  "Education": "#f43f5e", // rose
};

// Fallback colors for unknown categories
const COLORS = ["#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#06b6d4", "#6366f1", "#f43f5e"];

export function SpendingBreakdownChart() {
  const { transactions } = useAppContext();
  const { resolvedTheme } = useTheme();

  const data = useMemo(() => {
    // Let's filter to only expenses of the current month
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 6);

    const expenses = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return tx.type === "expense" && isAfter(txDate, sixMonthsAgo);
    });

    const grouped = groupByCategory(expenses);
    
    // Convert object to array for Recharts
    const chartData = Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    })).sort((a, b) => b.value - a.value);

    return chartData;
  }, [transactions]);

  const isDark = resolvedTheme === "dark";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#334155" : "#e2e8f0";

  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-96 items-center justify-center col-span-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 self-start">Spending Breakdown</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-slate-500 dark:text-slate-400">No expenses recorded this month.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm col-span-1 flex flex-col h-[400px]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Spending Breakdown</h3>
      
      <div className="flex-1 flex flex-col sm:flex-row items-center w-full gap-4">
        {/* Chart */}
        <div className="w-full sm:w-1/2 h-[200px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  color: isDark ? "#f8fafc" : "#0f172a"
                }}
                itemStyle={{ fontWeight: 600 }}
                formatter={(value: any) => formatCurrency(Number(value) || 0)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="w-full sm:w-1/2 flex flex-col gap-3 overflow-y-auto max-h-[200px] custom-scrollbar pr-2">
          {data.map((item, index) => {
            const percentage = ((item.value / totalExpense) * 100).toFixed(1);
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: CATEGORY_COLORS[item.name] || COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[100px]" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
