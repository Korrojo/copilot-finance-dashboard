import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface UpcomingItem {
  id: string;
  date: string;
  name: string;
  amount: number;
  type: 'bill' | 'income' | 'subscription';
  category?: string;
}

interface NextTwoWeeksPreviewProps {
  upcomingItems: UpcomingItem[];
}

export function NextTwoWeeksPreview({ upcomingItems }: NextTwoWeeksPreviewProps) {
  // Get next 14 days
  const today = new Date();
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Group items by date
  const itemsByDate = upcomingItems.reduce((acc, item) => {
    const date = new Date(item.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, UpcomingItem[]>);

  // Calculate totals
  const totalIncome = upcomingItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const totalExpenses = upcomingItems
    .filter(item => item.type !== 'income')
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const netChange = totalIncome - totalExpenses;

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">Next two weeks</h3>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-[#0a0e1a] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Income</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <p className="text-sm font-semibold text-green-400">
              {formatCompactCurrency(totalIncome)}
            </p>
          </div>
        </div>
        <div className="bg-[#0a0e1a] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Expenses</p>
          <div className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-400" />
            <p className="text-sm font-semibold text-red-400">
              {formatCompactCurrency(totalExpenses)}
            </p>
          </div>
        </div>
        <div className="bg-[#0a0e1a] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Net</p>
          <p className={`text-sm font-semibold ${netChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCompactCurrency(Math.abs(netChange))}
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1.5 max-h-80 overflow-y-auto">
        {next14Days.map((date, index) => {
          const dateString = date.toDateString();
          const items = itemsByDate[dateString] || [];
          const isToday = date.toDateString() === today.toDateString();
          const dayTotal = items.reduce((sum, item) => {
            return sum + (item.type === 'income' ? item.amount : -Math.abs(item.amount));
          }, 0);

          if (items.length === 0) {
            return (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#1a1f2e] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${
                    isToday ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-[#0a0e1a]'
                  }`}>
                    <span className={`text-xs font-medium ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </span>
                    <span className={`text-sm font-bold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">No upcoming items</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="bg-[#0a0e1a] rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center ${
                    isToday ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-[#141824]'
                  }`}>
                    <span className={`text-xs font-medium ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </span>
                    <span className={`text-sm font-bold ${isToday ? 'text-blue-400' : 'text-white'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                    <p className={`text-xs font-medium ${dayTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {dayTotal >= 0 ? '+' : ''}{formatCompactCurrency(dayTotal)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 ml-13">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        item.type === 'income'
                          ? 'bg-green-400'
                          : item.type === 'subscription'
                          ? 'bg-purple-400'
                          : 'bg-red-400'
                      }`} />
                      <span className="text-gray-300 truncate">{item.name}</span>
                    </div>
                    <span className={`font-medium ml-2 flex-shrink-0 ${
                      item.type === 'income' ? 'text-green-400' : 'text-white'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(item.amount), false)}
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    +{items.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
