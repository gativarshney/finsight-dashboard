"use client";

import { useState } from "react";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { useAppContext } from "@/context/AppContext";
import { Plus, Download } from "lucide-react";

export default function TransactionsPage() {
  const { role, transactions } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const downloadCSV = () => {
    const headers = ["ID", "Date", "Amount", "Category", "Type", "Description", "Merchant"];
    const rows = transactions.map(tx => [
      tx.id,
      tx.date,
      tx.amount.toString(),
      `"${tx.category}"`,
      tx.type,
      `"${tx.description}"`,
      `"${tx.merchant}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finsight_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all your financial records.</p>
        </div>
        {role === "Admin" && (
          <div className="flex items-center gap-3">
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          </div>
        )}
      </header>

      <TransactionTable />
      
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transactionToEdit={null}
      />
    </div>
  );
}
