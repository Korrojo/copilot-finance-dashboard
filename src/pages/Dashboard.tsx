import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Your financial overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Spending Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Monthly spending</p>
              <h2 className="text-3xl font-bold text-white">$3,526 left</h2>
              <p className="text-sm text-gray-500 mt-1">
                out of $8,557 budgeted
              </p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: '58%' }}
              />
            </div>
            <span className="text-xs text-green-400 font-medium">
              $3,874 under
            </span>
          </div>
        </div>

        {/* Assets Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Assets</p>
              <h2 className="text-3xl font-bold text-white">$1,430,545</h2>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">261.52%</span>
            <span className="text-gray-500">vs last year</span>
          </div>
        </div>

        {/* Debt Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Debt</p>
              <h2 className="text-3xl font-bold text-white">$283,756</h2>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">18.92%</span>
            <span className="text-gray-500">vs last year</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Spending Chart Placeholder */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Monthly spending
            </h3>
            <button className="text-blue-400 text-sm hover:text-blue-300">
              TRANSACTIONS →
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will go here
          </div>
        </div>

        {/* Top Categories Placeholder */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top categories</h3>
            <button className="text-blue-400 text-sm hover:text-blue-300">
              VIEW ALL →
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Child Support', spent: '$1,722', budget: '$861', color: 'bg-red-500' },
              { name: 'No Category', spent: '$886', budget: '-', color: 'bg-gray-500' },
              { name: 'Utility', spent: '$794', budget: '$753', color: 'bg-yellow-500' },
              { name: 'Food & Drink', spent: '$701', budget: '$700', color: 'bg-green-500' },
              { name: 'Gym-2', spent: '$505', budget: '$397', color: 'bg-purple-500' },
            ].map((category) => (
              <div key={category.name} className="flex items-center gap-3">
                <div className={`w-1 h-8 ${category.color} rounded-full`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{category.name}</span>
                    <span className="text-sm font-semibold text-white">
                      {category.spent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>Budget: {category.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions to Review */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Transactions to review
          </h3>
          <button className="text-blue-400 text-sm hover:text-blue-300">
            VIEW ALL →
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">
          No transactions to review
        </div>
      </div>
    </div>
  );
}
