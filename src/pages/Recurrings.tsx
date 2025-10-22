import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { UpcomingBills } from '../components/UpcomingBills';

export function Recurrings() {
  const {
    activeSubscriptions,
    subscriptions,
    totalMonthlyCost,
    yearlyProjection,
    upcomingBills,
    subscriptionsToReview,
    categorySpending,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
  } = useSubscriptions();

  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | 'paused'>('active');
  const [sortBy, setSortBy] = useState<'amount' | 'name' | 'nextBilling'>('amount');

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered =
      filter === 'all' ? subscriptions : subscriptions.filter(sub => sub.status === filter);

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'name':
          return a.merchantName.localeCompare(b.merchantName);
        case 'nextBilling':
          return a.pattern.nextDate.localeCompare(b.pattern.nextDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [subscriptions, filter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Recurring Payments</h1>
        <p className="text-gray-400">
          Manage your subscriptions and recurring transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Subscriptions</span>
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{activeSubscriptions.length}</div>
          <div className="text-xs text-gray-500 mt-1">
            {subscriptions.length - activeSubscriptions.length} inactive
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Monthly Cost</span>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            ${totalMonthlyCost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">per month</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Yearly Projection</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            ${yearlyProjection.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">estimated annually</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">To Review</span>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {subscriptionsToReview.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">needs attention</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions List (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters and Sort */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {(['all', 'active', 'cancelled', 'paused'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      filter === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="amount">Amount</option>
                  <option value="name">Name</option>
                  <option value="nextBilling">Next Billing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subscriptions Grid */}
          {filteredSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredSubscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onCancel={cancelSubscription}
                  onPause={pauseSubscription}
                  onResume={resumeSubscription}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No subscriptions found</p>
            </div>
          )}
        </div>

        {/* Sidebar (1 column) */}
        <div className="space-y-6">
          {/* Upcoming Bills */}
          <UpcomingBills bills={upcomingBills} maxItems={5} />

          {/* Category Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">By Category</h3>
            <div className="space-y-3">
              {categorySpending.map(({ category, amount }) => {
                const percentage = (amount / totalMonthlyCost) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{category}</span>
                      <span className="text-white font-medium">
                        ${amount.toFixed(2)}/mo
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {percentage.toFixed(1)}% of total
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Savings Opportunity */}
          {subscriptionsToReview.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Savings Opportunity
                  </h3>
                  <p className="text-sm text-gray-300">
                    Review {subscriptionsToReview.length} subscription
                    {subscriptionsToReview.length !== 1 ? 's' : ''} to potentially save money
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {subscriptionsToReview.slice(0, 3).map(sub => (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center text-sm p-2 bg-gray-800/50 rounded"
                  >
                    <span className="text-gray-300">{sub.merchantName}</span>
                    <span className="text-white font-medium">
                      ${sub.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
