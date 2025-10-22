import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowRightLeft,
  TrendingUp,
  Wallet,
  PieChart,
  Target,
  RefreshCw,
  BarChart3,
  Search,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft, badge: '470' },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Cash flow', href: '/cash-flow', icon: TrendingUp },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Investments', href: '/investments', icon: BarChart3 },
  { name: 'Categories', href: '/categories', icon: PieChart },
  { name: 'Recurrings', href: '/recurrings', icon: RefreshCw },
];

const accountSections = [
  {
    title: 'Credit cards',
    accounts: [
      { name: 'Apple Card', balance: '$3,949', icon: '🍎' },
      { name: 'Freedom - Emu', balance: '$11,789', icon: '💳' },
      { name: 'Sapphire', balance: '$751', icon: '💎' },
      { name: 'Citi-Costco', balance: '$280', icon: '🏪' },
      { name: 'Target', balance: '$130', icon: '🎯' },
    ],
  },
  {
    title: 'Depository',
    accounts: [
      { name: 'Bus.Checking', balance: '$24,890', icon: '🏦' },
      { name: 'Bet.Saving', balance: '$15,018', icon: '💰' },
      { name: 'Per.Checking', balance: '$9,115', icon: '✓' },
      { name: 'Apple Cash', balance: '$164', icon: '💵' },
    ],
  },
];

export function Sidebar() {
  return (
    <div className="w-60 bg-[#0a0e1a] border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Logo/Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 bg-[#141824] rounded-lg px-3 py-2 text-gray-400 text-sm">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-[#141824] hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="text-xs text-gray-500">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Account Sections */}
        <div className="mt-6 px-2">
          {accountSections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  {section.title}
                </h3>
                <button className="text-gray-500 hover:text-gray-400">
                  <span className="text-xs">▼</span>
                </button>
              </div>
              <div className="space-y-0.5">
                {section.accounts.map((account) => (
                  <button
                    key={account.name}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:bg-[#141824] hover:text-white rounded-lg transition-colors"
                  >
                    <span className="text-base">{account.icon}</span>
                    <span className="flex-1 text-left truncate">
                      {account.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {account.balance}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 p-2 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-[#141824] hover:text-white rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span>Get help</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:bg-[#141824] hover:text-white rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
