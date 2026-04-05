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
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center col-span-1 min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 self-start">Smart Insights</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-slate-500 dark:text-slate-400">Not enough data to generate insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((insight, idx) => {
        const Icon = insight.icon;
        return (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            {/* Background decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 ${insight.colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className={`p-3 rounded-xl ${insight.bgClass}`}>
                <Icon className={`h-6 w-6 ${insight.colorClass.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{insight.title}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className={insight.colorClass}>{insight.value}</span>
                </div>
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
