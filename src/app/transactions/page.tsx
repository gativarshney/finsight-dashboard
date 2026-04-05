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
    <div className="space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
      <header className="page-header mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-kicker">Ledger</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Transactions</h2>
          <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">View and manage all your financial records.</p>
        </div>
        {role === "Admin" && (
          <div className="flex items-center gap-3">
            <button
              onClick={downloadCSV}
              className="button-glow inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-[#1E2D45] dark:bg-[#0D1421] dark:text-slate-300 dark:hover:bg-[#111B2B]"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="button-glow inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(59,130,246,0.3)] hover:bg-blue-500"
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
