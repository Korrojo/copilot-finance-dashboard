import { Repeat } from 'lucide-react';
import type { RecurringPattern } from '../utils/recurringDetection';
import { formatFrequency, getConfidenceLevel } from '../utils/recurringDetection';

interface RecurringBadgeProps {
  pattern: RecurringPattern;
  size?: 'sm' | 'md';
  showConfidence?: boolean;
}

export function RecurringBadge({
  pattern,
  size = 'sm',
  showConfidence = false,
}: RecurringBadgeProps) {
  const confidenceInfo = getConfidenceLevel(pattern.confidence);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`inline-flex items-center gap-1 ${sizeClasses[size]} bg-purple-600/20 text-purple-400 rounded-full font-medium border border-purple-600/30`}
      >
        <Repeat className={iconSizes[size]} />
        <span>{formatFrequency(pattern.frequency)}</span>
      </div>

      {showConfidence && (
        <div
          className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium border`}
          style={{
            backgroundColor: `${confidenceInfo.color}20`,
            borderColor: `${confidenceInfo.color}50`,
            color: confidenceInfo.color,
          }}
        >
          {pattern.confidence}% confidence
        </div>
      )}
    </div>
  );
}
