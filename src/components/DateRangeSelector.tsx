import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export type DateRangePreset =
  | 'this_month'
  | 'last_month'
  | 'last_3_months'
  | 'last_12_months'
  | 'year_to_date'
  | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
  preset: DateRangePreset;
  label: string;
}

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets: Array<{ value: DateRangePreset; label: string }> = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_12_months', label: 'Last 12 Months' },
  { value: 'year_to_date', label: 'Year to Date' },
  { value: 'custom', label: 'Custom Range' },
];

export function getDateRangeFromPreset(preset: DateRangePreset): DateRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        start,
        end: today,
        preset,
        label: 'This Month',
      };
    }
    case 'last_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start,
        end,
        preset,
        label: 'Last Month',
      };
    }
    case 'last_3_months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return {
        start,
        end: today,
        preset,
        label: 'Last 3 Months',
      };
    }
    case 'last_12_months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      return {
        start,
        end: today,
        preset,
        label: 'Last 12 Months',
      };
    }
    case 'year_to_date': {
      const start = new Date(now.getFullYear(), 0, 1);
      return {
        start,
        end: today,
        preset,
        label: 'Year to Date',
      };
    }
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: today,
        preset: 'this_month',
        label: 'This Month',
      };
  }
}

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetSelect = (preset: DateRangePreset) => {
    const range = getDateRangeFromPreset(preset);
    onChange(range);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#141824] text-white rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{value.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-[#141824] rounded-lg border border-gray-700 shadow-xl z-20 min-w-[200px]">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetSelect(preset.value)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#1a1f2e] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value.preset === preset.value
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
