import { X } from 'lucide-react';

interface FilterChip {
  id: string;
  label: string;
  type: 'category' | 'account' | 'amount';
  value: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemove: (chipId: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ chips, onRemove, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null;

  const chipColors = {
    category: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    account: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    amount: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="flex items-center gap-2 flex-wrap animate-fade-in">
      <span className="text-sm text-gray-500">Active filters:</span>

      {chips.map((chip) => (
        <div
          key={chip.id}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
            chipColors[chip.type]
          } transition-all hover:scale-105`}
        >
          <span className="font-medium">{chip.label}</span>
          <button
            onClick={() => onRemove(chip.id)}
            className="hover:opacity-70 transition-opacity"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {chips.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-400 hover:text-white underline transition-colors ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
