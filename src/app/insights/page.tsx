import { InsightCards } from "@/components/insights/InsightCards";
import { MonthlyComparisonChart } from "@/components/charts/MonthlyComparisonChart";

export default function InsightsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Smart Insights</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Actionable takeaways based on your financial activity.</p>
        </div>
      </header>

      <InsightCards />
      <MonthlyComparisonChart />
    </div>
  );
}
