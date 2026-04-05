import { TransactionTable } from "@/components/transactions/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Transactions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage all your financial records.</p>
        </div>
        {/* Placeholder for "Add Transaction" button injected in the next step */}
      </header>

      <TransactionTable />
    </div>
  );
}
