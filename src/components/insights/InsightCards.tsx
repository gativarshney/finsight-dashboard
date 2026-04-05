"use client";

import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, getMonthlyTotals, groupByCategory } from "@/lib/utils";
import { 
  TrendingDown, 
  TrendingUp, 
  Award, 
  Target, 
  PieChart, 
  Zap,
  LucideIcon
} from "lucide-react";

interface InsightData {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export function InsightCards() {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (transactions.length === 0) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // For simplicity, defining last month.
    let lastMonth = currentMonth - 1;
    let lastMonthYear = currentYear;
    if (lastMonth < 0) {
      lastMonth = 11;
      lastMonthYear = currentYear - 1;
    }

    const currentMonthTxs = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const lastMonthTxs = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });

    // 1. Highest Spending Category This Month
    const currentExpenses = currentMonthTxs.filter(t => t.type === "expense");
    const groupedCurrentExp = groupByCategory(currentExpenses);
    let topCategory = "None";
    let topCategoryAmount = 0;
    let totalCurrentExp = 0;
    
    Object.entries(groupedCurrentExp).forEach(([cat, amt]) => {
      totalCurrentExp += amt;
      if (amt > topCategoryAmount) {
        topCategoryAmount = amt;
        topCategory = cat;
      }
    });

    const topCatPercentage = totalCurrentExp > 0 ? ((topCategoryAmount / totalCurrentExp) * 100).toFixed(1) : "0";

    // 2. Month-over-month expense change
    const lastMonthExpenses = lastMonthTxs.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    const momChange = lastMonthExpenses > 0 ? ((totalCurrentExp - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
    const momText = momChange > 0 
      ? `You spent ${momChange.toFixed(1)}% more than last month` 
      : lastMonthExpenses === 0 ? "No data for last month" : `You saved ${Math.abs(momChange).toFixed(1)}% compared to last month`;
    const isMomGood = momChange <= 0;

    // 3. Best Saving Month (last 6 months)
    const monthlyTotals = getMonthlyTotals(transactions);
    let bestMonth = "None";
    let bestSavings = -Infinity;
    let totalSixMonthExpense = 0;
    
    monthlyTotals.forEach(m => {
      const savings = m.income - m.expenses;
      totalSixMonthExpense += m.expenses;
      if (savings > bestSavings) {
        bestSavings = savings;
        bestMonth = m.month;
      }
    });

    // 4. Average Monthly Spending
    const avgMonthlySpending = monthlyTotals.length > 0 ? totalSixMonthExpense / monthlyTotals.length : 0;

    // 5. Income vs Expense Ratio (Total)
    let totalAllIncome = 0;
    let totalAllExpense = 0;
    transactions.forEach(t => {
       if (t.type === "income") totalAllIncome += t.amount;
       else totalAllExpense += t.amount;
    });
    const ratio = totalAllExpense > 0 ? (totalAllIncome / totalAllExpense).toFixed(2) : "N/A";

    // 6. Biggest Single Transaction This Month
    let biggestTx = { amount: 0, merchant: "None" };
    currentExpenses.forEach(t => {
      if (t.amount > biggestTx.amount) biggestTx = { amount: t.amount, merchant: t.merchant };
    });

    const items: InsightData[] = [
      {
        title: "Top Category",
        value: topCategory,
        description: `${topCatPercentage}% of this month's expenses (${formatCurrency(topCategoryAmount)})`,
        icon: PieChart,
        colorClass: "text-amber-500 font-bold text-xl",
        bgClass: "bg-amber-50 dark:bg-amber-500/10"
      },
      {
        title: "MoM Expense Change",
        value: isMomGood ? "Decreased" : "Increased",
        description: momText,
        icon: isMomGood ? TrendingDown : TrendingUp,
        colorClass: `${isMomGood ? 'text-emerald-500' : 'text-rose-500'} font-bold text-xl`,
        bgClass: isMomGood ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-rose-50 dark:bg-rose-500/10"
      },
      {
        title: "Best Saving Month",
        value: bestMonth,
        description: `Saved ${formatCurrency(bestSavings)}`,
        icon: Award,
        colorClass: "text-indigo-500 font-bold text-xl",
        bgClass: "bg-indigo-50 dark:bg-indigo-500/10"
      },
      {
        title: "Avg Monthly Spend",
        value: formatCurrency(avgMonthlySpending),
        description: "Across the last 6 months",
        icon: Target,
        colorClass: "text-sky-500 font-bold text-xl",
        bgClass: "bg-sky-50 dark:bg-sky-500/10"
      },
      {
        title: "Income/Expense Ratio",
        value: `${ratio}x`,
        description: "For every $1 spent, you earn",
        icon: Zap,
        colorClass: "text-violet-500 font-bold text-xl",
        bgClass: "bg-violet-50 dark:bg-violet-500/10"
      },
      {
        title: "Largest Transaction",
        value: formatCurrency(biggestTx.amount),
        description: `Spent at ${biggestTx.merchant} this month`,
        icon: TrendingDown,
        colorClass: "text-rose-500 font-bold text-xl",
        bgClass: "bg-rose-50 dark:bg-rose-500/10"
      }
    ];

    // fix last item icon dynamically
    items[5].icon = TrendingDown; 

    return items;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="app-panel col-span-1 flex min-h-[300px] flex-col items-center justify-center p-6">
        <h3 className="mb-6 self-start text-lg font-semibold tracking-tight text-[var(--text-primary)]">Smart Insights</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
              <Zap className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">Not enough data to generate insights</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add more transactions to unlock trend analysis and category intelligence.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight, idx) => {
        const Icon = insight.icon;
        const isTopCategory = insight.title === "Top Category";
        const percentageText = insight.description.split("%")[0];
        return (
          <div key={idx} className="app-panel group relative overflow-hidden p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-blue-400/50 to-transparent" />
            <Icon className={`absolute bottom-4 right-4 h-20 w-20 opacity-10 ${insight.colorClass.split(' ')[0]}`} />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className={`rounded-2xl p-3 ${insight.bgClass}`}>
                <Icon className={`h-6 w-6 ${insight.colorClass.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{insight.title}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={`${insight.colorClass} value-tabular`}>{insight.value}</span>
                </div>
                {isTopCategory && (
                  <div className="mt-3 h-2 w-full max-w-44 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${Number.parseFloat(percentageText) || 0}%` }}
                    />
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
