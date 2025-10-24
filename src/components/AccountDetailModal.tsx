import { useEffect } from 'react';
import { X, RefreshCw, Edit2, AlertCircle, CheckCircle, WifiOff, Wifi } from 'lucide-react';
import type { DetailedAccount, AccountHealth, AccountConnection } from '../types/account';
import { ACCOUNT_HEALTH_COLORS, CONNECTION_STATUS_COLORS } from '../types/account';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { AccountBalanceChart } from './charts/AccountBalanceChart';
import { AccountTransactionList } from './AccountTransactionList';

interface AccountDetailModalProps {
  account: DetailedAccount;
  health: AccountHealth;
  connection?: AccountConnection;
  transactions?: Transaction[];
  balanceHistory?: Array<{ date: string; balance: number }>;
  onClose: () => void;
  onSync: (accountId: string) => void;
  onSetNickname: (accountId: string, nickname: string) => void;
  onDisconnect?: (connectionId: string) => void;
}

export function AccountDetailModal({
  account,
  health,
  connection,
  transactions = [],
  balanceHistory = [],
  onClose,
  onSync,
  onSetNickname,
  onDisconnect,
}: AccountDetailModalProps) {
  const isCredit = account.type === 'credit';
  const utilization = isCredit && account.limit
    ? (Math.abs(account.currentBalance) / account.limit) * 100
    : 0;

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Generate mock balance history if not provided
  const chartData = balanceHistory.length > 0 ? balanceHistory : generateMockBalanceHistory(account);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Slide-in panel from right */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-gray-900 border-l border-gray-700 overflow-y-auto shadow-2xl animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
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
          {/* Balance Chart */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Balance History</h3>
            <AccountBalanceChart
              data={chartData}
              color={account.color || '#3b82f6'}
              type={account.type}
            />
          </div>

          {/* Balance Breakdown */}
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

          {/* Connection Status */}
          {connection && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connection</h3>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {connection.status === 'connected' ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`px-2 py-1 rounded text-xs font-medium ${CONNECTION_STATUS_COLORS[connection.status]}`}>
                      {connection.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {connection.institutionName}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Synced</span>
                    <span className="text-white">
                      {new Date(connection.lastSync).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {connection.nextSync && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Sync</span>
                      <span className="text-white">
                        {new Date(connection.nextSync).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  {connection.errorMessage && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                      {connection.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
              <AccountTransactionList
                transactions={transactions}
                accountId={account.id}
                limit={5}
              />
            </div>
          )}

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
            {onDisconnect && connection && (
              <button
                onClick={() => {
                  if (confirm(`Disconnect ${connection.institutionName}?`)) {
                    onDisconnect(connection.id);
                    onClose();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
              >
                <WifiOff className="w-4 h-4" />
                Disconnect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock balance history
function generateMockBalanceHistory(account: DetailedAccount): Array<{ date: string; balance: number }> {
  const history: Array<{ date: string; balance: number }> = [];
  const today = new Date();
  const currentBalance = account.currentBalance;

  // Generate 12 months of history
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);

    // Calculate a reasonable historical balance based on account type
    let balance: number;
    if (account.type === 'credit') {
      // Credit cards: vary from 50% to 100% of current balance
      const factor = 0.5 + (Math.random() * 0.5);
      balance = currentBalance * factor;
    } else if (account.type === 'investment') {
      // Investments: generally growing trend
      const growth = Math.pow(1.08, i / 12); // 8% annual growth
      const volatility = 0.95 + (Math.random() * 0.1); // ±5% volatility
      balance = currentBalance / growth * volatility;
    } else {
      // Debit: vary around current balance
      const variation = 0.7 + (Math.random() * 0.6); // ±30% variation
      balance = currentBalance * variation;
    }

    history.push({
      date: date.toISOString().split('T')[0],
      balance: Math.max(0, balance),
    });
  }

  return history;
}
