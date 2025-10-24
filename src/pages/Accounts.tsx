import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Plus } from 'lucide-react';
import { useAccounts } from '../hooks/useAccounts';
import { AccountDetailModal } from '../components/AccountDetailModal';
import { ConnectionStatusCard } from '../components/ConnectionStatusCard';
import { NetWorthSummary } from '../components/NetWorthSummary';
import { AccountCard } from '../components/AccountCard';
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
                const connection = connections.find(c => c.id === account.connectionId);

                if (!connection) return null;

                return (
                  <AccountCard
                    key={account.id}
                    account={account}
                    health={health}
                    connection={connection}
                    sparklineData={getAccountSparklineData(account)}
                    showBalances={showBalances}
                    onClick={() => setSelectedAccount(account)}
                  />
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
                const connection = connections.find(c => c.id === account.connectionId);

                if (!connection) return null;

                return (
                  <AccountCard
                    key={account.id}
                    account={account}
                    health={health}
                    connection={connection}
                    sparklineData={getAccountSparklineData(account)}
                    showBalances={showBalances}
                    onClick={() => setSelectedAccount(account)}
                  />
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
                const connection = connections.find(c => c.id === account.connectionId);

                if (!connection) return null;

                return (
                  <AccountCard
                    key={account.id}
                    account={account}
                    health={health}
                    connection={connection}
                    sparklineData={getAccountSparklineData(account)}
                    showBalances={showBalances}
                    onClick={() => setSelectedAccount(account)}
                  />
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
          connection={connections.find(c => c.id === selectedAccount.connectionId)}
          transactions={[]} // TODO: Pass actual transactions when available
          onClose={() => setSelectedAccount(null)}
          onSync={syncAccount}
          onSetNickname={setAccountNickname}
          onDisconnect={disconnectAccount}
        />
      )}
    </div>
  );
}
