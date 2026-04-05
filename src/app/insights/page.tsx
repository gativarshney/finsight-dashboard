import { InsightCards } from "@/components/insights/InsightCards";
import { MonthlyComparisonChart } from "@/components/charts/MonthlyComparisonChart";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
      <header className="page-header mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="section-kicker">Analytics</span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Smart Insights</h2>
          <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">Actionable takeaways based on your financial activity.</p>
        </div>
      </header>

      <InsightCards />
      <MonthlyComparisonChart />
    </div>
  );
}
