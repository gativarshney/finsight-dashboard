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
      color: "text-blue-500",
      bgClass: "bg-blue-500/10",
    },
    {
      title: "Monthly Income",
      value: formatCurrency(metrics.currentIncome),
      trend: metrics.incomeTrend,
      icon: DollarSign,
      color: "text-cyan-500",
      bgClass: "bg-cyan-500/10",
    },
    {
      title: "Monthly Expenses",
      value: formatCurrency(metrics.currentExpense),
      trend: metrics.expenseTrend,
      icon: CreditCard,
      color: "text-red-500",
      bgClass: "bg-red-500/10",
      invertTrend: true, // Higher expense -> 'bad' (red arrow), wait, generally expense up means red.
    },
    {
      title: "Savings Rate",
      value: `${metrics.savingsRate.toFixed(1)}%`,
      trend: null, // Just show static rate or we could calculate trend
      icon: TrendingUp,
      color: "text-cyan-500",
      bgClass: "bg-cyan-500/10",
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
            className="app-panel group relative overflow-hidden p-6 transition-all hover:-translate-y-0.5"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500 via-blue-400/50 to-transparent" />
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-2xl p-3 ${card.bgClass}`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
              {card.trend !== null && (
                <div className={`flex items-center space-x-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${isUp ? 'border-cyan-500/20 bg-cyan-500/10' : 'border-red-500/20 bg-red-500/10'} ${trendColor}`}>
                  {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{card.title}</p>
              <h3 className="value-tabular text-2xl font-bold tracking-tight text-[var(--text-primary)]">{card.value}</h3>
            </div>
            <div className="mt-5">
              <svg viewBox="0 0 120 24" className="h-7 w-full">
                <path
                  d={card.trend === null
                    ? "M2 16 C26 16, 42 16, 58 16 S88 16, 118 16"
                    : isUp
                      ? "M2 18 C18 18, 28 15, 42 14 S68 10, 82 9 S102 8, 118 6"
                      : "M2 7 C18 7, 30 9, 44 11 S66 15, 82 16 S102 18, 118 19"}
                  fill="none"
                  stroke={idx === 0 ? "#3B82F6" : idx === 1 ? "#06B6D4" : idx === 2 ? "#EF4444" : "#06B6D4"}
                  strokeOpacity="0.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
