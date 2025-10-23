import { Bell, DollarSign, Phone, Wifi, Tv, Shield } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface BillReminder {
  id: string;
  service: string;
  provider: string;
  monthlyAmount: number;
  contractEndDate: string;
  yearsWithProvider: number;
  avgMarketRate: number;
  potentialSavings: number;
  icon: 'phone' | 'wifi' | 'tv' | 'insurance';
  urgency: 'high' | 'medium' | 'low';
  tips: string[];
}

const MOCK_REMINDERS: BillReminder[] = [
  {
    id: '1',
    service: 'Internet',
    provider: 'Spectrum',
    monthlyAmount: 89.99,
    contractEndDate: '2025-11-15',
    yearsWithProvider: 3,
    avgMarketRate: 59.99,
    potentialSavings: 30,
    icon: 'wifi',
    urgency: 'high',
    tips: [
      'Mention competitor offers from AT&T or Verizon',
      'Ask for loyalty discount after 3 years',
      'Request to speak with retention department',
      'Threaten to cancel if no better rate offered',
    ],
  },
  {
    id: '2',
    service: 'Mobile Phone',
    provider: 'Verizon',
    monthlyAmount: 75.00,
    contractEndDate: '2025-12-20',
    yearsWithProvider: 5,
    avgMarketRate: 50.00,
    potentialSavings: 25,
    icon: 'phone',
    urgency: 'medium',
    tips: [
      'Check for new customer promotions',
      'Consider switching to T-Mobile or Mint Mobile',
      'Ask about family plan discounts',
      'Negotiate autopay discount',
    ],
  },
  {
    id: '3',
    service: 'Cable TV',
    provider: 'Comcast',
    monthlyAmount: 120.00,
    contractEndDate: '2026-03-10',
    yearsWithProvider: 2,
    avgMarketRate: 80.00,
    potentialSavings: 40,
    icon: 'tv',
    urgency: 'high',
    tips: [
      'Consider cutting cable for streaming services',
      'Ask for promotional rate matching',
      'Bundle with internet for better pricing',
      'Negotiate channel package reduction',
    ],
  },
  {
    id: '4',
    service: 'Car Insurance',
    provider: 'State Farm',
    monthlyAmount: 165.00,
    contractEndDate: '2025-10-30',
    yearsWithProvider: 4,
    avgMarketRate: 130.00,
    potentialSavings: 35,
    icon: 'insurance',
    urgency: 'high',
    tips: [
      'Get quotes from Progressive, Geico, and Liberty Mutual',
      'Ask about safe driver discounts',
      'Increase deductible to lower premium',
      'Bundle with home insurance',
    ],
  },
];

const ICON_MAP = {
  phone: Phone,
  wifi: Wifi,
  tv: Tv,
  insurance: Shield,
};

const URGENCY_COLORS = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' },
  medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400' },
  low: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500/20 text-green-400' },
};

export function BillNegotiationReminders() {
  const totalPotentialSavings = MOCK_REMINDERS.reduce((sum, r) => sum + r.potentialSavings, 0);
  const annualSavings = totalPotentialSavings * 12;

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Bill Negotiation Reminders</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Potential Monthly Savings</p>
          <p className="text-lg font-bold text-green-400">{formatCurrency(totalPotentialSavings)}</p>
          <p className="text-xs text-gray-500">{formatCurrency(annualSavings)}/year</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        These bills are due for renegotiation. Take action to reduce your monthly expenses.
      </p>

      <div className="space-y-4">
        {MOCK_REMINDERS.map((reminder) => {
          const Icon = ICON_MAP[reminder.icon];
          const colors = URGENCY_COLORS[reminder.urgency];
          const daysUntilEnd = Math.ceil((new Date(reminder.contractEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={reminder.id}
              className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{reminder.service}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge} uppercase`}>
                      {reminder.urgency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{reminder.provider}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{formatCurrency(reminder.monthlyAmount)}/mo</p>
                  <p className="text-xs text-gray-500">Avg: {formatCurrency(reminder.avgMarketRate)}/mo</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div className="bg-[#0a0e1a] rounded-lg p-2">
                  <p className="text-xs text-gray-500">Contract Ends</p>
                  <p className="text-white font-medium">{new Date(reminder.contractEndDate).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">{daysUntilEnd} days</p>
                </div>
                <div className="bg-[#0a0e1a] rounded-lg p-2">
                  <p className="text-xs text-gray-500">Potential Savings</p>
                  <p className={`font-bold ${colors.text}`}>{formatCurrency(reminder.potentialSavings)}/mo</p>
                  <p className="text-xs text-gray-500">{formatCurrency(reminder.potentialSavings * 12)}/year</p>
                </div>
              </div>

              <div className="bg-[#0a0e1a] rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-400 mb-2">Negotiation Tips:</p>
                <ul className="space-y-1">
                  {reminder.tips.map((tip, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" />
                Start Negotiation
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
