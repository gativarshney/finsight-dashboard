export function PageSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3" />
        <div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 h-[140px] flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 col-span-1 lg:col-span-2 h-[400px]">
           <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
           <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-900/50 rounded-xl" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 col-span-1 h-[400px]">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="h-[200px] w-full rounded-full bg-slate-100 dark:bg-slate-900/50 mx-auto" />
        </div>
      </div>
    </div>
  );
}
