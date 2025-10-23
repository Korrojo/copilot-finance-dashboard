import { useState, useRef, useEffect } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';
import { TAG_COLORS } from '../utils/tagHelpers';

interface TagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagSelector({
  selectedTags,
  availableTags,
  onTagsChange,
  placeholder = 'Add tags...',
  maxTags = 10,
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get tag color (cycling through predefined colors)
  const getTagColor = (tag: string) => {
    const index = availableTags.indexOf(tag);
    return TAG_COLORS[index % TAG_COLORS.length];
  };

  // Filter suggestions based on input
  const suggestions = inputValue.trim()
    ? availableTags.filter(
        tag =>
          !selectedTags.includes(tag) &&
          tag.toLowerCase().includes(inputValue.toLowerCase())
      )
    : availableTags.filter(tag => !selectedTags.includes(tag));

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
      setFocusedIndex(-1);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
        addTag(suggestions[focusedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocusedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag) => {
            const color = getTagColor(tag);
            return (
              <div
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-all hover:scale-105"
                style={{
                  backgroundColor: `${color}20`,
                  borderColor: `${color}50`,
                  color: color,
                }}
              >
                <TagIcon className="w-3 h-3" />
                <span>{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input Field */}
      {selectedTags.length < maxTags && (
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg focus-within:border-blue-500 transition-colors">
            <Plus className="w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-[#141824] border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
              {suggestions.map((tag, index) => {
                const color = getTagColor(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      index === focusedIndex
                        ? 'bg-blue-600/20'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-white">{tag}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Create New Tag Hint */}
          {showSuggestions && inputValue.trim() && !availableTags.includes(inputValue.trim()) && (
            <div className="absolute z-10 w-full mt-1 bg-[#141824] border border-gray-700 rounded-lg shadow-xl">
              <div className="px-3 py-2 text-sm text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> or{' '}
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">,</kbd> to create "
                <span className="text-blue-400">{inputValue.trim()}</span>"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Max Tags Warning */}
      {selectedTags.length >= maxTags && (
        <p className="text-xs text-amber-400 mt-2">
          Maximum of {maxTags} tags reached
        </p>
      )}
    </div>
  );
}
