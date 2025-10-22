import { useState } from 'react';
import { TrendingUp, TrendingDown, Settings, DollarSign, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const accounts = [
  {
    id: '1',
    name: 'Apple Card',
    type: 'Credit Card',
    balance: 3948.74,
    change: 77.42,
    changePercent: 2.0,
    trend: 'up',
    mask: '****',
    color: 'orange',
  },
  {
    id: '2',
    name: 'Freedom - Emu',
    type: 'Credit Card',
    balance: 1789.18,
    change: 110.50,
    changePercent: 6.43,
    trend: 'up',
    mask: '7539',
    color: 'blue',
  },
  {
    id: '3',
    name: 'Sapphire',
    type: 'Credit Card',
    balance: 751.36,
    change: 25.32,
    changePercent: 3.43,
    trend: 'up',
    mask: '6823',
    color: 'purple',
  },
  {
    id: '4',
    name: 'Bus.Checking',
    type: 'Depository',
    balance: 24889.74,
    change: -1650.50,
    changePercent: -6.21,
    trend: 'down',
    mask: '5395',
    color: 'green',
  },
  {
    id: '5',
    name: 'Bet.Saving',
    type: 'Depository',
    balance: 15018.00,
    change: 150.60,
    changePercent: 1.01,
    trend: 'up',
    mask: '2351',
    color: 'teal',
  },
  {
    id: '6',
    name: 'Apple Cash',
    type: 'Depository',
    balance: 164.00,
    change: 0,
    changePercent: 0,
    trend: 'neutral',
    mask: '',
    color: 'gray',
  },
];

export function Accounts() {
  const [showBalances, setShowBalances] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'Credit Card' | 'Depository'>('all');

  const totalAssets = accounts
    .filter((a) => a.type === 'Depository')
    .reduce((sum, a) => sum + a.balance, 0);
  const totalDebt = accounts
    .filter((a) => a.type === 'Credit Card')
    .reduce((sum, a) => sum + a.balance, 0);
  const netWorth = totalAssets - totalDebt;

  const filteredAccounts = filterType === 'all'
    ? accounts
    : accounts.filter(a => a.type === filterType);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Accounts</h1>
          <p className="text-gray-400">Manage all your connected accounts</p>
        </div>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="flex items-center gap-2 px-4 py-2 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600"
        >
          {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Net Worth</p>
              <h2 className="text-3xl font-bold text-blue-400">
                {showBalances ? formatCurrency(netWorth) : '••••••'}
              </h2>
            </div>
            <DollarSign className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">12.5%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Assets</p>
              <h2 className="text-3xl font-bold text-green-400">
                {showBalances ? formatCurrency(totalAssets) : '••••••'}
              </h2>
            </div>
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">18.92%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Debt</p>
              <h2 className="text-3xl font-bold text-red-400">
                {showBalances ? formatCurrency(totalDebt) : '••••••'}
              </h2>
            </div>
            <Settings className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">5.21%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>
      </div>

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
          onClick={() => setFilterType('Credit Card')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filterType === 'Credit Card'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-[#141824] text-gray-300 border-gray-700 hover:border-gray-600'
          }`}
        >
          Credit Cards ({accounts.filter(a => a.type === 'Credit Card').length})
        </button>
        <button
          onClick={() => setFilterType('Depository')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            filterType === 'Depository'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-[#141824] text-gray-300 border-gray-700 hover:border-gray-600'
          }`}
        >
          Depository ({accounts.filter(a => a.type === 'Depository').length})
        </button>
      </div>

      {/* Accounts Grid */}
      <div>
        {(filterType === 'all' || filterType === 'Credit Card') && filteredAccounts.some(a => a.type === 'Credit Card') && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Credit cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts
                .filter((a) => a.type === 'Credit Card')
                .map((account) => (
                  <div
                    key={account.id}
                    className="bg-[#141824] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {account.name}
                        </h3>
                        <p className="text-sm text-gray-500">{account.mask && `****${account.mask}`}</p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          account.trend === 'up' ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                      ></div>
                    </div>

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-white">
                        {showBalances ? formatCurrency(account.balance) : '••••••'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      {account.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-orange-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-400" />
                      )}
                      <span
                        className={`font-medium ${
                          account.trend === 'up' ? 'text-orange-400' : 'text-green-400'
                        }`}
                      >
                        {account.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-gray-500">this month</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {(filterType === 'all' || filterType === 'Depository') && filteredAccounts.some(a => a.type === 'Depository') && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Depository</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts
                .filter((a) => a.type === 'Depository')
                .map((account) => (
                  <div
                    key={account.id}
                    className="bg-[#141824] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {account.name}
                        </h3>
                        <p className="text-sm text-gray-500">{account.mask && `****${account.mask}`}</p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          account.trend === 'up'
                            ? 'bg-green-500'
                            : account.trend === 'down'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                        }`}
                      ></div>
                    </div>

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-white">
                        {showBalances ? formatCurrency(account.balance) : '••••••'}
                      </p>
                    </div>

                    {account.changePercent !== 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        {account.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`font-medium ${
                            account.trend === 'up' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {Math.abs(account.changePercent).toFixed(2)}%
                        </span>
                        <span className="text-gray-500">this month</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
