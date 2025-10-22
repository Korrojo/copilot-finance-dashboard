interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
  ranges?: Array<{ value: string; label: string }>;
}

const DEFAULT_RANGES = [
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
  { value: 'ALL', label: 'ALL' },
];

export function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  ranges = DEFAULT_RANGES,
}: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex items-center gap-1 bg-[#141824] rounded-lg p-1 border border-gray-800">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            selectedRange === range.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
