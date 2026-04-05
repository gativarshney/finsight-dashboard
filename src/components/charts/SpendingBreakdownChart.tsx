"use client";

import { useMemo } from "react";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAppContext } from "@/context/AppContext";
import { groupByCategory, formatCurrency } from "@/lib/utils";
import { useTheme } from "next-themes";
import { subMonths, isAfter } from "date-fns";

const COLORS = ["#3B82F6", "#06B6D4", "#8B5CF6", "#F59E0B", "#10B981", "#EF4444", "#EC4899", "#14B8A6"];

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
  const tooltipBg = isDark ? "#0D1421" : "#ffffff";
  const tooltipBorder = isDark ? "#1E2D45" : "#e2e8f0";

  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <div className="app-panel col-span-1 flex h-96 flex-col items-center justify-center p-6">
        <h3 className="mb-6 self-start text-lg font-semibold tracking-tight text-[var(--text-primary)]">Spending Breakdown</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
              <PieChartIcon className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">No expense mix available</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Expense categories will appear here as soon as spending is recorded.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-panel col-span-1 flex h-[400px] flex-col p-6">
      <div className="mb-6">
        <span className="section-kicker">Allocation</span>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Spending Breakdown</h3>
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row items-center w-full gap-4 overflow-hidden">
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
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderColor: tooltipBorder,
                  borderRadius: "1rem",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
                  color: isDark ? "#f8fafc" : "#0f172a"
                }}
                itemStyle={{ fontWeight: 600 }}
                formatter={(value: number) => formatCurrency(Number(value) || 0)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="w-full sm:w-1/2 flex flex-col gap-3 overflow-y-auto max-h-[160px] sm:max-h-[200px] custom-scrollbar pr-2 min-w-0">
          {data.map((item, index) => {
            const percentage = ((item.value / totalExpense) * 100).toFixed(1);
            return (
              <div key={item.name} className="flex items-center justify-between text-sm flex-shrink-0 pr-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-slate-600 dark:text-slate-400 truncate" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="value-tabular font-semibold text-[var(--text-primary)] whitespace-nowrap">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
