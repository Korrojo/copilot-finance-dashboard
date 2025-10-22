import { X, RefreshCw, Edit2, AlertCircle, CheckCircle } from 'lucide-react';
import type { DetailedAccount, AccountHealth } from '../types/account';
import { ACCOUNT_HEALTH_COLORS } from '../types/account';
import { formatCurrency } from '../utils/formatCurrency';

interface AccountDetailModalProps {
  account: DetailedAccount;
  health: AccountHealth;
  onClose: () => void;
  onSync: (accountId: string) => void;
  onSetNickname: (accountId: string, nickname: string) => void;
}

export function AccountDetailModal({
  account,
  health,
  onClose,
  onSync,
  onSetNickname,
}: AccountDetailModalProps) {
  const isCredit = account.type === 'credit';
  const utilization = isCredit && account.limit
    ? (Math.abs(account.currentBalance) / account.limit) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: account.color }}
              />
              <h2 className="text-2xl font-bold text-white">{account.name}</h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{account.institution}</span>
              <span>•</span>
              <span>••• {account.mask}</span>
              <span>•</span>
              <span className="capitalize">{account.subtype || account.type}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Balance Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Balance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Current Balance</div>
                <div className={`text-2xl font-bold ${account.currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(Math.abs(account.currentBalance))}
                </div>
              </div>

              {account.availableBalance !== undefined && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Available</div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(account.availableBalance)}
                  </div>
                </div>
              )}

              {isCredit && account.limit && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Credit Limit</div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency(account.limit)}
                  </div>
                </div>
              )}
            </div>

            {/* Credit Utilization */}
            {isCredit && account.limit && (
              <div className="mt-4 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Credit Utilization</span>
                  <span className={`text-sm font-medium ${
                    utilization > 80 ? 'text-red-400' : utilization > 50 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {utilization.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(utilization, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Health Score */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Account Health</h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${ACCOUNT_HEALTH_COLORS[health.status]}`}>
                    {health.status.toUpperCase()}
                  </div>
                  <span className="text-white text-lg font-bold">{health.score}/100</span>
                </div>
              </div>

              {/* Issues */}
              {health.issues.length > 0 && (
                <div className="space-y-2">
                  {health.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 p-3 rounded-lg border ${
                        issue.severity === 'high'
                          ? 'bg-red-500/10 border-red-500/30'
                          : issue.severity === 'medium'
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <AlertCircle className={`w-4 h-4 mt-0.5 ${
                        issue.severity === 'high'
                          ? 'text-red-400'
                          : issue.severity === 'medium'
                          ? 'text-yellow-400'
                          : 'text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm text-white">{issue.message}</div>
                        {issue.actionable && issue.action && (
                          <div className="text-xs text-gray-400 mt-1">
                            Suggested: {issue.action}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {health.issues.length === 0 && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">No issues detected</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          {account.monthlySpending !== undefined && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Monthly Spending</div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(account.monthlySpending)}
                  </div>
                </div>

                {account.transactionCount !== undefined && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Transactions</div>
                    <div className="text-xl font-bold text-white">
                      {account.transactionCount}
                    </div>
                  </div>
                )}

                {account.averageTransaction !== undefined && (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-1">Avg Transaction</div>
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(account.averageTransaction)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
              {account.openedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Opened</span>
                  <span className="text-white">
                    {new Date(account.openedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {account.lastTransactionDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Transaction</span>
                  <span className="text-white">
                    {new Date(account.lastTransactionDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">Currency</span>
                <span className="text-white">{account.currency}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={account.isActive ? 'text-green-400' : 'text-gray-400'}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              onClick={() => onSync(account.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Account
            </button>
            <button
              onClick={() => {
                const nickname = prompt('Enter nickname for this account:', account.nickname || account.name);
                if (nickname) onSetNickname(account.id, nickname);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Nickname
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
