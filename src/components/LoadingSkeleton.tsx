export function CardSkeleton() {
  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800 animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-gray-700 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-[#141824] rounded-lg border border-gray-800 animate-pulse">
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="h-5 bg-gray-700 rounded w-1/4 mb-6 animate-pulse"></div>
      <div className="h-64 bg-gray-700/20 rounded animate-pulse flex items-end gap-2 px-4 pb-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-700 rounded-t"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-6 bg-gray-700 rounded w-24"></div>
        </div>
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-16 bg-gray-700/20 rounded mb-3"></div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-700 rounded w-24"></div>
        <div className="h-3 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  );
}

export function InvestmentCardSkeleton() {
  return (
    <div className="bg-[#141824] rounded-xl p-5 border border-gray-800 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="h-4 bg-gray-700 rounded w-20 mb-2"></div>
          <div className="h-5 bg-gray-700 rounded w-24"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-12"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-700/20 rounded"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="bg-[#141824] rounded-xl border border-gray-800 overflow-hidden">
      <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-800 bg-gray-900/50">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
      <div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-800/50">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-5 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
          <TransactionListSkeleton />
        </div>
        <div className="space-y-4">
          <div className="h-5 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}
