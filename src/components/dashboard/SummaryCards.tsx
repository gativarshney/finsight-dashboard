"use client";

import { useAppContext } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet, TrendingUp, CreditCard } from "lucide-react";
import { useMemo } from "react";

export function SummaryCards() {
  const { transactions } = useAppContext();

  const metrics = useMemo(() => {
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

    let totalBalance = 0;
    let balanceEndOflastMonth = 0;
    
    let currentIncome = 0;
    let currentExpense = 0;
    let lastMonthIncome = 0;
    let lastMonthExpense = 0;

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const isCurrentMonth = txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
      const isLastMonth = txDate.getMonth() === lastMonth && txDate.getFullYear() === lastMonthYear;
      const amount = tx.amount;

      if (tx.type === "income") {
        totalBalance += amount;
        if (isCurrentMonth) currentIncome += amount;
        if (isLastMonth) lastMonthIncome += amount;
        if (txDate.getTime() < new Date(currentYear, currentMonth, 1).getTime()) {
          balanceEndOflastMonth += amount;
        }
      } else {
        totalBalance -= amount;
        if (isCurrentMonth) currentExpense += amount;
        if (isLastMonth) lastMonthExpense += amount;
        if (txDate.getTime() < new Date(currentYear, currentMonth, 1).getTime()) {
          balanceEndOflastMonth -= amount;
        }
      }
    });

    const savingsCurrent = currentIncome - currentExpense;
    const savingsRate = currentIncome > 0 ? (savingsCurrent / currentIncome) * 100 : 0;
    
    // Trends calculations
    const balanceTrend = balanceEndOflastMonth !== 0 
      ? ((totalBalance - balanceEndOflastMonth) / Math.abs(balanceEndOflastMonth)) * 100 
      : 0;

    const incomeTrend = lastMonthIncome !== 0 
      ? ((currentIncome - lastMonthIncome) / lastMonthIncome) * 100 
      : 0;

    const expenseTrend = lastMonthExpense !== 0 
      ? ((currentExpense - lastMonthExpense) / lastMonthExpense) * 100 
      : 0;

    return {
      balance: totalBalance,
      balanceTrend,
      currentIncome,
      incomeTrend,
      currentExpense,
      expenseTrend,
      savingsRate,
    };
  }, [transactions]);

  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(metrics.balance),
      trend: metrics.balanceTrend,
      icon: Wallet,
      color: "text-indigo-500",
      bgClass: "bg-indigo-500/10",
    },
    {
      title: "Monthly Income",
      value: formatCurrency(metrics.currentIncome),
      trend: metrics.incomeTrend,
      icon: DollarSign,
      color: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
    {
      title: "Monthly Expenses",
      value: formatCurrency(metrics.currentExpense),
      trend: metrics.expenseTrend,
      icon: CreditCard,
      color: "text-rose-500",
      bgClass: "bg-rose-500/10",
      invertTrend: true, // Higher expense -> 'bad' (red arrow), wait, generally expense up means red.
    },
    {
      title: "Savings Rate",
      value: `${metrics.savingsRate.toFixed(1)}%`,
      trend: null, // Just show static rate or we could calculate trend
      icon: TrendingUp,
      color: "text-sky-500",
      bgClass: "bg-sky-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isUp = card.trend !== null && card.trend > 0;
        const trendValue = card.trend !== null ? Math.abs(card.trend).toFixed(1) + "%" : "";
        
        let trendColor = "text-slate-500";
        if (card.trend !== null) {
          if (card.invertTrend) {
            trendColor = isUp ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400";
          } else {
            trendColor = isUp ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400";
          }
        }

        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgClass}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              {card.trend !== null && (
                <div className={`flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-full ${isUp ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'} ${trendColor}`}>
                  {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{card.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
