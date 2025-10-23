import { X, Tag, Trash2, CheckCircle } from 'lucide-react';

interface BulkActionToolbarProps {
  selectedCount: number;
  onCategorize: () => void;
  onDelete: () => void;
  onMarkReviewed: () => void;
  onClearSelection: () => void;
}

export function BulkActionToolbar({
  selectedCount,
  onCategorize,
  onDelete,
  onMarkReviewed,
  onClearSelection,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-up">
      <div className="bg-[#141824] border border-gray-700 rounded-xl shadow-2xl px-6 py-4 flex items-center gap-6">
        {/* Selected Count */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-white font-semibold">
            {selectedCount} selected
          </span>
        </div>

        <div className="w-px h-8 bg-gray-700"></div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCategorize}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Tag className="w-4 h-4" />
            Categorize
          </button>

          <button
            onClick={onMarkReviewed}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Reviewed
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        <div className="w-px h-8 bg-gray-700"></div>

        {/* Clear Selection */}
        <button
          onClick={onClearSelection}
          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
          title="Clear selection"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
