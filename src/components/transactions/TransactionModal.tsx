"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Transaction, Category, TransactionType } from "@/types";
import { useAppContext } from "@/context/AppContext";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

const ALL_CATEGORIES = {
  expense: ["Food & Dining", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Rent", "Education"],
  income: ["Salary", "Freelance", "Investment Returns", "Bonus"]
};

export function TransactionModal({ isOpen, onClose, transactionToEdit }: TransactionModalProps) {
  const { addTransaction, editTransaction } = useAppContext();
  
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food & Dining");
  const [merchant, setMerchant] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setDate(transactionToEdit.date);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setMerchant(transactionToEdit.merchant);
      setDescription(transactionToEdit.description);
    } else {
      // Reset form
      setType("expense");
      setDate(new Date().toISOString().split('T')[0]);
      setAmount("");
      setCategory("Food & Dining");
      setMerchant("");
      setDescription("");
    }
    setError("");
  }, [transactionToEdit, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!date || !amount || !category || !merchant || !description) {
      setError("Please fill in all fields.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const txData = {
      type,
      date,
      amount: numAmount,
      category,
      merchant,
      description
    };

    if (transactionToEdit) {
      editTransaction(transactionToEdit.id, txData);
    } else {
      addTransaction(txData);
    }
    onClose();
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === "expense" ? "Food & Dining" : "Salary");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-900/80" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[1.75rem] border border-[color:var(--card-border)] bg-[var(--card)] shadow-[0_24px_60px_rgba(15,23,42,0.32)]">
        
        <div className="flex items-center justify-between border-b border-[color:var(--card-border)] p-6">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
            {transactionToEdit ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button onClick={onClose} className="button-glow min-h-11 min-w-11 cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-50 dark:border-[#1E2D45] dark:bg-[#0D1421] dark:hover:bg-[#111B2B]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">
              {error}
            </div>
          )}

          <form id="tx-form" onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-[#09101B]">
              <button
                type="button"
                onClick={() => handleTypeChange("expense")}
                className={`button-glow min-h-11 flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${type === "expense" ? "bg-white text-slate-900 shadow-sm dark:bg-[#0D1421] dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("income")}
                className={`button-glow min-h-11 flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${type === "income" ? "bg-white text-slate-900 shadow-sm dark:bg-[#0D1421] dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
              >
                Income
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="value-tabular min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-7 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#1E2D45] dark:bg-[#09101B] dark:text-white"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#1E2D45] dark:bg-[#09101B] dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="min-h-11 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#1E2D45] dark:bg-[#09101B] dark:text-white"
              >
                {ALL_CATEGORIES[type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Merchant</label>
              <input 
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#1E2D45] dark:bg-[#09101B] dark:text-white"
                placeholder="e.g. Amazon"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <input 
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#1E2D45] dark:bg-[#09101B] dark:text-white"
                placeholder="e.g. Office supplies"
              />
            </div>

          </form>
        </div>

        <div className="mt-auto flex justify-end gap-3 border-t border-[color:var(--card-border)] bg-slate-50/80 p-6 dark:bg-[#0B1220]">
          <button 
            type="button" 
            onClick={onClose}
            className="button-glow min-h-11 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#111B2B]"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="tx-form"
            className="button-glow min-h-11 rounded-full border border-blue-400/40 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(59,130,246,0.3)] hover:bg-blue-500"
          >
            {transactionToEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>

      </div>
    </>
  );
}
