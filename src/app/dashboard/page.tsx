import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { BalanceTrendChart } from "@/components/charts/BalanceTrendChart";
import { SpendingBreakdownChart } from "@/components/charts/SpendingBreakdownChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here&apos;s your financial summary and recent activity.</p>
      </header>

      {/* Top 4 KPI Cards */}
      <SummaryCards />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      {/* Recent Transactions List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions />
      </div>
    </div>
  );
}
