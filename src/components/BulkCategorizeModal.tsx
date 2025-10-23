import { useState } from 'react';
import { X, Tag } from 'lucide-react';

interface BulkCategorizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorize: (category: string) => void;
  categories: string[];
  selectedCount: number;
}

export function BulkCategorizeModal({
  isOpen,
  onClose,
  onCategorize,
  categories,
  selectedCount,
}: BulkCategorizeModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      onCategorize(selectedCategory);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#141824] rounded-xl border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Bulk Categorize</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <p className="text-gray-400">
              Select a category to apply to {selectedCount} selected transaction{selectedCount !== 1 ? 's' : ''}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#0a0e1a] text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-400">
                  {selectedCount} transaction{selectedCount !== 1 ? 's' : ''} will be categorized as{' '}
                  <span className="font-semibold">{selectedCategory}</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
