import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import type { UpcomingBill } from '../types/subscription';

interface RecurringCalendarViewProps {
  upcomingBills: UpcomingBill[];
}

export function RecurringCalendarView({ upcomingBills }: RecurringCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  // Group bills by date
  const billsByDate = useMemo(() => {
    const grouped: Record<string, UpcomingBill[]> = {};
    upcomingBills.forEach(bill => {
      const billDate = new Date(bill.dueDate);
      if (
        billDate.getMonth() === currentMonth.getMonth() &&
        billDate.getFullYear() === currentMonth.getFullYear()
      ) {
        const day = billDate.getDate();
        if (!grouped[day]) {
          grouped[day] = [];
        }
        grouped[day].push(bill);
      }
    });
    return grouped;
  }, [upcomingBills, currentMonth]);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  // Calculate total for the month
  const monthlyTotal = Object.values(billsByDate)
    .flat()
    .reduce((sum, bill) => sum + bill.estimatedAmount, 0);

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Monthly Calendar</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-white font-medium">{formatCurrency(monthlyTotal)}</span>
            <span className="text-gray-500">this month</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="text-white font-medium min-w-[140px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#0a0e1a] rounded-lg p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const bills = billsByDate[day] || [];
            const hasNills = bills.length > 0;
            const totalForDay = bills.reduce((sum, bill) => sum + bill.estimatedAmount, 0);
            const isPastDue = bills.some(bill => bill.isPastDue);

            return (
              <div
                key={day}
                className={`aspect-square p-2 rounded-lg border transition-all ${
                  isToday(day)
                    ? 'border-blue-500 bg-blue-500/10'
                    : hasNills
                    ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday(day)
                          ? 'text-blue-400'
                          : hasNills
                          ? 'text-white'
                          : 'text-gray-500'
                      }`}
                    >
                      {day}
                    </span>
                    {isPastDue && (
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </div>

                  {hasNills && (
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="space-y-1">
                        {bills.slice(0, 2).map(bill => (
                          <div
                            key={bill.subscription.id}
                            className="text-xs truncate"
                            title={bill.subscription.merchantName}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block mr-1" />
                            <span className="text-gray-300">
                              {bill.subscription.merchantName.slice(0, 10)}
                              {bill.subscription.merchantName.length > 10 ? '...' : ''}
                            </span>
                          </div>
                        ))}
                        {bills.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{bills.length - 2} more
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-medium text-green-400 mt-1">
                        {formatCurrency(totalForDay, false)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-blue-500 bg-blue-500/10" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>Recurring payment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Past due</span>
        </div>
      </div>
    </div>
  );
}
