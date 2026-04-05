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
  Trash2
} from "lucide-react";
import { Transaction, Category } from "@/types";
import { isAfter, subDays, subMonths } from "date-fns";
import { TransactionModal } from "./TransactionModal";

type SortField = "date" | "amount";
type SortOrder = "asc" | "desc";

const ALL_CATEGORIES: Category[] = [
  "Food & Dining", "Transport", "Shopping", "Entertainment", 
  "Health", "Utilities", "Rent", "Education",
  "Salary", "Freelance", "Investment Returns", "Bonus"
];

export function TransactionTable() {
  const { transactions, filters, setFilters, resetFilters, role, deleteTransaction } = useAppContext();
  
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState<Transaction | null>(null);

  // Toggle sort
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
      ? current.filter(c => c !== cat) 
      : [...current, cat];
    setFilters({ categories: next });
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      const searchMatch = !filters.search || 
        tx.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.merchant.toLowerCase().includes(filters.search.toLowerCase());
      
      // Type
      const typeMatch = filters.type === "All" || tx.type === filters.type;

      // Category
      const catMatch = filters.categories.length === 0 || filters.categories.includes(tx.category);

      // Date Range
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
      } else {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  }, [transactions, filters, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-slate-400" />;
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search merchants..." 
              value={filters.search}
              onChange={(e) => { setFilters({ search: e.target.value }); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <select 
              value={filters.type}
              onChange={(e) => { setFilters({ type: e.target.value as any }); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select 
              value={filters.dateRange}
              onChange={(e) => { setFilters({ dateRange: e.target.value as any }); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
            >
              <option value="All">All Time</option>
              <option value="Last 7d">Last 7 Days</option>
              <option value="Last 30d">Last 30 Days</option>
              <option value="Last 3m">Last 3 Months</option>
              <option value="Last 6m">Last 6 Months</option>
            </select>
            
            {/* Reset Filters */}
            {(filters.search || filters.type !== "All" || filters.dateRange !== "All" || filters.categories.length > 0) && (
              <button 
                onClick={() => { resetFilters(); setCurrentPage(1); }}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors tooltip"
                title="Reset Filters"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Categories
          </span>
          {ALL_CATEGORIES.map(cat => {
            const isSelected = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  isSelected 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto w-full">
        {/* Swipe Hint (Mobile Only) */}
        <div className="sm:hidden px-6 py-2 text-center text-xs text-slate-400 dark:text-slate-500">
          ← Swipe to see more →
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-100 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-slate-700 dark:hover:text-slate-300" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-2">Date <SortIcon field="date" /></div>
              </th>
              <th className="px-6 py-4 font-medium">Merchant / Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 text-right" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end gap-2">Amount <SortIcon field="amount" /></div>
              </th>
              {/* Future Action Column Placeholder */}
              <th className="px-6 py-4 font-medium text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-lg font-medium text-slate-900 dark:text-white">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                    {formatDate(tx.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{tx.merchant}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                      tx.type === 'income' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-semibold ${
                      tx.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {role === "Admin" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setTxToEdit(tx); setEditModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { if(confirm('Are you sure you want to delete this transaction?')) deleteTransaction(tx.id); }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredData.length}</span> results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <TransactionModal 
        isOpen={editModalOpen} 
        onClose={() => { setEditModalOpen(false); setTxToEdit(null); }} 
        transactionToEdit={txToEdit} 
      />
    </div>
  );
}
