"use client";

import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Edit2,
  Trash2,
} from "lucide-react";
import { Transaction, Category, FilterState } from "@/types";
import { isAfter, subDays, subMonths } from "date-fns";
import { TransactionModal } from "./TransactionModal";

type SortField = "date" | "amount";
type SortOrder = "asc" | "desc";

const ALL_CATEGORIES: Category[] = [
  "Food & Dining", "Transport", "Shopping", "Entertainment",
  "Health", "Utilities", "Rent", "Education",
  "Salary", "Freelance", "Investment Returns", "Bonus",
];

const CATEGORY_STYLES: Partial<Record<Category, string>> = {
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

export function TransactionTable() {
  const { transactions, filters, setFilters, resetFilters, role, deleteTransaction } = useAppContext();

  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const toggleCategory = (cat: Category) => {
    const current = filters.categories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setFilters({ categories: next });
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return transactions.filter((tx) => {
      const searchMatch = !filters.search ||
        tx.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.merchant.toLowerCase().includes(filters.search.toLowerCase());

      const typeMatch = filters.type === "All" || tx.type === filters.type;
      const catMatch = filters.categories.length === 0 || filters.categories.includes(tx.category);

      let dateMatch = true;
      const txDate = new Date(tx.date);
      const now = new Date();
      if (filters.dateRange === "Last 7d") dateMatch = isAfter(txDate, subDays(now, 7));
      else if (filters.dateRange === "Last 30d") dateMatch = isAfter(txDate, subDays(now, 30));
      else if (filters.dateRange === "Last 3m") dateMatch = isAfter(txDate, subMonths(now, 3));
      else if (filters.dateRange === "Last 6m") dateMatch = isAfter(txDate, subMonths(now, 6));

      return searchMatch && typeMatch && catMatch && dateMatch;
    }).sort((a, b) => {
      if (sortField === "date") {
        const dA = new Date(a.date).getTime();
        const dB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dA - dB : dB - dA;
      }
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    });
  }, [transactions, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-slate-400" />;
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="app-panel flex flex-col overflow-hidden">
      <div className="space-y-4 border-b border-[color:var(--card-border)] p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={filters.search}
              onChange={(e) => { setFilters({ search: e.target.value }); setCurrentPage(1); }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#1E2D45] dark:bg-[#09101B]"
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <select
              value={filters.type}
              onChange={(e) => { setFilters({ type: e.target.value as FilterState["type"] }); setCurrentPage(1); }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none dark:border-[#1E2D45] dark:bg-[#09101B]"
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.dateRange}
              onChange={(e) => { setFilters({ dateRange: e.target.value as FilterState["dateRange"] }); setCurrentPage(1); }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:outline-none dark:border-[#1E2D45] dark:bg-[#09101B]"
            >
              <option value="All">All Time</option>
              <option value="Last 7d">Last 7 Days</option>
              <option value="Last 30d">Last 30 Days</option>
              <option value="Last 3m">Last 3 Months</option>
              <option value="Last 6m">Last 6 Months</option>
            </select>

            {(filters.search || filters.type !== "All" || filters.dateRange !== "All" || filters.categories.length > 0) && (
              <button
                onClick={() => { resetFilters(); setCurrentPage(1); }}
                className="button-glow rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:text-red-500 dark:border-[#1E2D45] dark:bg-[#0D1421]"
                title="Reset Filters"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            <Filter className="h-3 w-3" /> Categories
          </span>
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border border-blue-500/20 bg-blue-500/12 text-blue-500"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-[#1E2D45] dark:bg-[#09101B] dark:text-slate-400 dark:hover:bg-[#111B2B]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="px-6 py-2 text-center text-xs text-slate-400 dark:text-slate-500 sm:hidden">
          &larr; Swipe to see more &rarr;
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[color:var(--card-border)] bg-slate-50/90 text-xs uppercase tracking-[0.24em] text-slate-500 dark:bg-white/[0.02] dark:text-slate-400">
            <tr>
              <th className="cursor-pointer px-6 py-4 font-medium hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-2">Date {getSortIcon("date")}</div>
              </th>
              <th className="px-6 py-4 font-medium">Merchant / Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="cursor-pointer px-6 py-4 text-right font-medium hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end gap-2">Amount {getSortIcon("amount")}</div>
              </th>
              <th className="w-24 px-6 py-4 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--card-border)]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 rounded-full bg-blue-500/10 p-4">
                      <Search className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((tx) => (
                <tr key={tx.id} className="transition-colors odd:bg-transparent even:bg-slate-50/65 hover:bg-blue-500/5 dark:even:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--text-primary)]">{tx.merchant}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{tx.description}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[tx.category] ?? "bg-slate-500/15 text-slate-500"}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      tx.type === "income"
                        ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-500"
                        : "border-red-500/20 bg-red-500/10 text-red-500"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`value-tabular whitespace-nowrap px-6 py-4 text-right font-mono font-semibold ${
                    tx.type === "income" ? "text-cyan-500" : "text-[var(--text-primary)]"
                  }`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {role === "Admin" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setTxToEdit(tx); setEditModalOpen(true); }}
                          className="button-glow rounded-xl border border-transparent p-1.5 text-slate-400 transition-colors hover:border-blue-500/10 hover:bg-blue-500/10 hover:text-blue-500"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm("Are you sure you want to delete this transaction?")) deleteTransaction(tx.id); }}
                          className="button-glow rounded-xl border border-transparent p-1.5 text-slate-400 transition-colors hover:border-red-500/10 hover:bg-red-500/10 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[color:var(--card-border)] px-6 py-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-[var(--text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-[var(--text-primary)]">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-[var(--text-primary)]">{filteredData.length}</span> results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="button-glow rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1E2D45] dark:bg-[#0D1421] dark:hover:bg-[#111B2B]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="button-glow rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1E2D45] dark:bg-[#0D1421] dark:hover:bg-[#111B2B]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setTxToEdit(null); }}
        transactionToEdit={txToEdit}
      />
    </div>
  );
}
