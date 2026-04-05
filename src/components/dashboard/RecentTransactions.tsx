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
  DollarSign
} from "lucide-react";
import { Category } from "@/types";

const categoryIcons: Record<string, any> = {
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

export function RecentTransactions() {
  const { transactions } = useAppContext();
  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center col-span-1 lg:col-span-3 min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 self-start">Recent Transactions</h3>
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-slate-500 dark:text-slate-400">No transactions recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm col-span-1 lg:col-span-3 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
        <Link 
          href="/transactions" 
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors group"
        >
          View all 
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-y border-slate-100 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Transaction</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentTransactions.map((tx) => {
              const Icon = categoryIcons[tx.category] || DollarSign;
              const isIncome = tx.type === "income";
              
              return (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 w-max sm:w-auto">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0">
                        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-slate-100">{tx.description}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{tx.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell w-max">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <span className={`font-semibold ${isIncome ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
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
