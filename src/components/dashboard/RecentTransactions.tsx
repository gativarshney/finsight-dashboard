"use client";

import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { 
  ArrowRight, 
  ShoppingCart, 
  Car, 
  Utensils, 
  Film, 
  HeartPulse, 
  Zap, 
  Home, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Gift, 
  DollarSign,
  LucideIcon,
} from "lucide-react";
import { Category } from "@/types";

const categoryIcons: Record<string, LucideIcon> = {
  "Food & Dining": Utensils,
  "Transport": Car,
  "Shopping": ShoppingCart,
  "Entertainment": Film,
  "Health": HeartPulse,
  "Utilities": Zap,
  "Rent": Home,
  "Education": BookOpen,
  "Salary": Briefcase,
  "Freelance": Briefcase,
  "Investment Returns": TrendingUp,
  "Bonus": Gift,
};

const categoryBadgeStyles: Partial<Record<Category, string>> = {
  "Food & Dining": "bg-amber-500/15 text-amber-500",
  "Transport": "bg-blue-500/15 text-blue-500",
  "Shopping": "bg-pink-500/15 text-pink-500",
  "Entertainment": "bg-violet-500/15 text-violet-500",
  "Health": "bg-emerald-500/15 text-emerald-500",
  "Utilities": "bg-cyan-500/15 text-cyan-500",
  "Rent": "bg-rose-500/15 text-rose-500",
  "Education": "bg-indigo-500/15 text-indigo-500",
  "Salary": "bg-cyan-500/15 text-cyan-500",
  "Freelance": "bg-sky-500/15 text-sky-500",
  "Investment Returns": "bg-emerald-500/15 text-emerald-500",
  "Bonus": "bg-fuchsia-500/15 text-fuchsia-500",
};

export function RecentTransactions() {
  const { transactions } = useAppContext();
  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="app-panel col-span-1 flex min-h-[300px] flex-col items-center justify-center p-6 lg:col-span-3">
        <h3 className="mb-6 self-start text-lg font-semibold tracking-tight text-[var(--text-primary)]">Recent Transactions</h3>
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-blue-500/10 p-4 text-blue-500">
              <DollarSign className="h-8 w-8" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)]">No transactions yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your latest activity will appear here once the ledger starts moving.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-panel col-span-1 flex flex-col p-6 lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="section-kicker">Activity Feed</span>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Recent Transactions</h3>
        </div>
        <Link 
          href="/transactions" 
          className="group flex min-h-11 cursor-pointer items-center gap-1 text-sm font-semibold text-blue-500 transition-all hover:text-blue-400 active:scale-[0.99]"
        >
          View all 
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm text-left">
          <thead className="border-y border-[color:var(--card-border)] bg-slate-50/90 text-xs uppercase tracking-[0.24em] text-slate-500 dark:bg-white/[0.02] dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Transaction</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--card-border)]">
            {recentTransactions.map((tx) => {
              const Icon = categoryIcons[tx.category] || DollarSign;
              const isIncome = tx.type === "income";
              
              return (
                <tr key={tx.id} className="transition-colors odd:bg-transparent even:bg-slate-50/70 hover:bg-blue-500/5 dark:even:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 w-max sm:w-auto">
                      <div className="shrink-0 rounded-xl bg-blue-500/10 p-2 text-blue-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[var(--text-primary)]">{tx.description}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{tx.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell w-max">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${categoryBadgeStyles[tx.category] ?? "bg-slate-500/15 text-slate-500"}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className={`value-tabular font-mono font-semibold ${isIncome ? 'text-cyan-500' : 'text-[var(--text-primary)]'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
