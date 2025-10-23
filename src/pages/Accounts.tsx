import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useAccounts } from '../hooks/useAccounts';
import { AccountDetailModal } from '../components/AccountDetailModal';
import { ConnectionStatusCard } from '../components/ConnectionStatusCard';
import { Sparkline } from '../components/charts/Sparkline';
import { NetWorthSummary } from '../components/NetWorthSummary';
import { ACCOUNT_HEALTH_COLORS } from '../types/account';
import type { DetailedAccount } from '../types/account';

export function Accounts() {
  const [showBalances, setShowBalances] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit' | 'investment'>('all');
  const [selectedAccount, setSelectedAccount] = useState<DetailedAccount | null>(null);
  const [showConnections, setShowConnections] = useState(false);

  const {
    accounts,
    connections,
    netWorth,
    totalAssets,
    totalLiabilities,
    accountsNeedingAttention,
    accountHealthMap,
    syncAccount,
    disconnectAccount,
    setAccountNickname,
  } = useAccounts();

  const filteredAccounts =
    filterType === 'all' ? accounts : accounts.filter(a => a.type === filterType);

  const creditAccounts = filteredAccounts.filter(a => a.type === 'credit');
  const debitAccounts = filteredAccounts.filter(a => a.type === 'debit');
  const investmentAccounts = filteredAccounts.filter(a => a.type === 'investment');

  // Calculate monthly change (mock - in real app this would come from data)
  const netWorthChange = 12.5;
  const assetsChange = 18.92;
  const liabilitiesChange = -5.21;

  // Generate mock sparkline data for account (in real app, this would come from API)
  const getAccountSparklineData = (account: DetailedAccount): number[] => {
    const balance = Math.abs(account.currentBalance);
    return Array.from({ length: 12 }, (_, i) => {
      const trend = account.type === 'investment' ? 1.05 : account.type === 'credit' ? 0.95 : 1.02;
      const randomFactor = 0.95 + Math.random() * 0.1;
      return balance * Math.pow(trend, (i - 11) / 11) * randomFactor;
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Accounts</h1>
          <p className="text-gray-400">Manage all your connected accounts</p>
        </div>
        <div className="flex items-center gap-3">
          {accountsNeedingAttention.length > 0 && (
            <button
              onClick={() => setShowConnections(!showConnections)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/20"
            >
              <AlertCircle className="w-4 h-4" />
              <span>{accountsNeedingAttention.length} need attention</span>
            </button>
          )}
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center gap-2 px-4 py-2 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600"
          >
            {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </button>
        </div>
      </div>

      {/* Net Worth Summary with Chart */}
      <NetWorthSummary
        netWorth={netWorth}
        totalAssets={totalAssets}
        totalLiabilities={totalLiabilities}
        netWorthChange={netWorthChange}
        assetsChange={assetsChange}
        liabilitiesChange={liabilitiesChange}
        showBalances={showBalances}
      />

      {/* Connections Section (Toggleable) */}
      {showConnections && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Connections</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map(connection => {
              const accountCount = connection.linkedAccounts.length;
              return (
                <ConnectionStatusCard
                  key={connection.id}
                  connection={connection}
                  accountCount={accountCount}
                  onSync={() => {
                    // Sync all accounts in this connection
                    connection.linkedAccounts.forEach(accId => syncAccount(accId));
                  }}
                  onDisconnect={() => disconnectAccount(connection.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filterType === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-[#141824] text-gray-300 border-gray-700 hover:border-gray-600'
          }`}
        >
          All Accounts ({accounts.length})
        </button>
        <button
          onClick={() => setFilterType('credit')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filterType === 'credit'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-[#141824] text-gray-300 border-gray-700 hover:border-gray-600'
          }`}
        >
          Credit ({creditAccounts.length})
        </button>
        <button
          onClick={() => setFilterType('debit')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filterType === 'debit'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-[#141824] text-gray-300 border-gray-700 hover:border-gray-600'
          }`}
        >
          Depository ({debitAccounts.length})
        </button>
        <button
          onClick={() => setFilterType('investment')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filterType === 'investment'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-[#141824] text-gray-300 border-gray-700 hover:border-gray-600'
          }`}
        >
          Investments ({investmentAccounts.length})
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="space-y-8">
        {/* Credit Cards */}
        {(filterType === 'all' || filterType === 'credit') && creditAccounts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Credit Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creditAccounts.map(account => {
                const health = accountHealthMap[account.id];
                const utilization = account.limit
                  ? (Math.abs(account.currentBalance) / account.limit) * 100
                  : 0;

                return (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className="bg-[#141824] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {account.nickname || account.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {account.institution} ••• {account.mask}
                        </p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      />
                    </div>

                    <div className="mb-3">
                      <p className="text-2xl font-bold text-white">
                        {showBalances ? formatCurrency(Math.abs(account.currentBalance)) : '••••••'}
                      </p>
                      {account.limit && (
                        <p className="text-sm text-gray-400 mt-1">
                          of {formatCurrency(account.limit)} limit
                        </p>
                      )}
                    </div>

                    {/* Utilization Bar */}
                    {account.limit && (
                      <div className="mb-3">
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              utilization > 80
                                ? 'bg-red-500'
                                : utilization > 50
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Sparkline */}
                    <div className="mb-3">
                      <Sparkline
                        data={getAccountSparklineData(account)}
                        width={200}
                        height={32}
                        color={utilization > 80 ? '#ef4444' : utilization > 50 ? '#eab308' : '#22c55e'}
                        fillColor={utilization > 80 ? 'rgba(239, 68, 68, 0.1)' : utilization > 50 ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)'}
                      />
                    </div>

                    {/* Health Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ACCOUNT_HEALTH_COLORS[health.status]
                        }`}
                      >
                        {health.status.toUpperCase()}
                      </span>
                      {health.score !== undefined && (
                        <span className="text-xs text-gray-500">{health.score}/100</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Depository Accounts */}
        {(filterType === 'all' || filterType === 'debit') && debitAccounts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Depository</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {debitAccounts.map(account => {
                const health = accountHealthMap[account.id];

                return (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className="bg-[#141824] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {account.nickname || account.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {account.institution} ••• {account.mask}
                        </p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      />
                    </div>

                    <div className="mb-3">
                      <p className="text-2xl font-bold text-white">
                        {showBalances ? formatCurrency(account.currentBalance) : '••••••'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1 capitalize">
                        {account.subtype || account.type}
                      </p>
                    </div>

                    {/* Sparkline */}
                    <div className="mb-3">
                      <Sparkline
                        data={getAccountSparklineData(account)}
                        width={200}
                        height={32}
                        color="#3b82f6"
                        fillColor="rgba(59, 130, 246, 0.1)"
                      />
                    </div>

                    {/* Health Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ACCOUNT_HEALTH_COLORS[health.status]
                        }`}
                      >
                        {health.status.toUpperCase()}
                      </span>
                      {health.score !== undefined && (
                        <span className="text-xs text-gray-500">{health.score}/100</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Investment Accounts */}
        {(filterType === 'all' || filterType === 'investment') && investmentAccounts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentAccounts.map(account => {
                const health = accountHealthMap[account.id];

                return (
                  <div
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className="bg-[#141824] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {account.nickname || account.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {account.institution} ••• {account.mask}
                        </p>
                      </div>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      />
                    </div>

                    <div className="mb-3">
                      <p className="text-2xl font-bold text-white">
                        {showBalances ? formatCurrency(account.currentBalance) : '••••••'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1 capitalize">
                        {account.subtype || account.type}
                      </p>
                    </div>

                    {/* Sparkline */}
                    <div className="mb-3">
                      <Sparkline
                        data={getAccountSparklineData(account)}
                        width={200}
                        height={32}
                        color="#10b981"
                        fillColor="rgba(16, 185, 129, 0.1)"
                      />
                    </div>

                    {/* Health Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ACCOUNT_HEALTH_COLORS[health.status]
                        }`}
                      >
                        {health.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Account Detail Modal */}
      {selectedAccount && (
        <AccountDetailModal
          account={selectedAccount}
          health={accountHealthMap[selectedAccount.id]}
          onClose={() => setSelectedAccount(null)}
          onSync={syncAccount}
          onSetNickname={setAccountNickname}
        />
      )}
    </div>
  );
}
