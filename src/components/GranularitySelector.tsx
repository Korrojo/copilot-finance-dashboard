import { Calendar } from 'lucide-react';

export type TimeGranularity = 'daily' | 'weekly' | 'monthly';

interface GranularitySelectorProps {
  value: TimeGranularity;
  onChange: (granularity: TimeGranularity) => void;
  className?: string;
}

const granularityOptions: Array<{ value: TimeGranularity; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function GranularitySelector({
  value,
  onChange,
  className = '',
}: GranularitySelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Calendar className="w-4 h-4 text-gray-400" />
      <div className="flex items-center bg-[#141824] border border-gray-700 rounded-lg overflow-hidden">
        {granularityOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              value === option.value
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
            } ${option.value !== 'monthly' ? 'border-r border-gray-700' : ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
