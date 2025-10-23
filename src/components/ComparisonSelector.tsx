import { useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import type { DateRange } from './DateRangeSelector';

export type ComparisonType = 'previous_period' | 'same_period_last_year' | 'none';

export interface ComparisonPeriod {
  type: ComparisonType;
  label: string;
  start?: Date;
  end?: Date;
}

interface ComparisonSelectorProps {
  value: ComparisonPeriod;
  currentRange: DateRange;
  onChange: (comparison: ComparisonPeriod) => void;
}

const comparisonTypes: Array<{ value: ComparisonType; label: string }> = [
  { value: 'previous_period', label: 'Previous Period' },
  { value: 'same_period_last_year', label: 'Same Period Last Year' },
  { value: 'none', label: 'No Comparison' },
];

export function getComparisonPeriod(
  type: ComparisonType,
  currentRange: DateRange
): ComparisonPeriod {
  if (type === 'none') {
    return {
      type,
      label: 'No Comparison',
    };
  }

  const { start, end } = currentRange;
  const duration = end.getTime() - start.getTime();

  if (type === 'previous_period') {
    const compStart = new Date(start.getTime() - duration - 86400000); // -1 day
    const compEnd = new Date(start.getTime() - 86400000); // day before current start
    return {
      type,
      label: 'Previous Period',
      start: compStart,
      end: compEnd,
    };
  }

  // same_period_last_year
  const compStart = new Date(start);
  compStart.setFullYear(compStart.getFullYear() - 1);
  const compEnd = new Date(end);
  compEnd.setFullYear(compEnd.getFullYear() - 1);

  return {
    type,
    label: 'Same Period Last Year',
    start: compStart,
    end: compEnd,
  };
}

export function ComparisonSelector({
  value,
  currentRange,
  onChange,
}: ComparisonSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: ComparisonType) => {
    const comparison = getComparisonPeriod(type, currentRange);
    onChange(comparison);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#141824] text-gray-400 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-sm"
      >
        <TrendingUp className="w-4 h-4" />
        <span>compared to</span>
        <span className="text-white font-medium">{value.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-[#141824] rounded-lg border border-gray-700 shadow-xl z-20 min-w-[220px]">
            {comparisonTypes.map((comp) => (
              <button
                key={comp.value}
                onClick={() => handleSelect(comp.value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#1a1f2e] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value.type === comp.value
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-300'
                }`}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
