import { useState } from 'react';
import {
  ShoppingCart,
  Coffee,
  Utensils,
  Car,
  Home,
  Zap,
  Plane,
  Heart,
  Film,
  Music,
  Book,
  Dumbbell,
  Shirt,
  Dog,
  Briefcase,
  GraduationCap,
  Gift,
  Smartphone,
  Scissors,
  Droplet,
  Package,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CategoryIcon {
  name: string;
  icon: LucideIcon;
  label: string;
}

const CATEGORY_ICONS: CategoryIcon[] = [
  { name: 'shopping', icon: ShoppingCart, label: 'Shopping' },
  { name: 'coffee', icon: Coffee, label: 'Coffee' },
  { name: 'dining', icon: Utensils, label: 'Dining' },
  { name: 'auto', icon: Car, label: 'Auto' },
  { name: 'home', icon: Home, label: 'Home' },
  { name: 'utility', icon: Zap, label: 'Utility' },
  { name: 'travel', icon: Plane, label: 'Travel' },
  { name: 'health', icon: Heart, label: 'Health' },
  { name: 'entertainment', icon: Film, label: 'Entertainment' },
  { name: 'music', icon: Music, label: 'Music' },
  { name: 'books', icon: Book, label: 'Books' },
  { name: 'fitness', icon: Dumbbell, label: 'Fitness' },
  { name: 'clothing', icon: Shirt, label: 'Clothing' },
  { name: 'pets', icon: Dog, label: 'Pets' },
  { name: 'business', icon: Briefcase, label: 'Business' },
  { name: 'education', icon: GraduationCap, label: 'Education' },
  { name: 'gifts', icon: Gift, label: 'Gifts' },
  { name: 'tech', icon: Smartphone, label: 'Tech' },
  { name: 'personal', icon: Scissors, label: 'Personal Care' },
  { name: 'utilities', icon: Droplet, label: 'Utilities' },
  { name: 'subscriptions', icon: Package, label: 'Subscriptions' },
  { name: 'other', icon: MoreHorizontal, label: 'Other' },
];

interface CategoryIconPickerProps {
  selectedIcon?: string;
  onSelect: (iconName: string) => void;
}

export function CategoryIconPicker({ selectedIcon, onSelect }: CategoryIconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = CATEGORY_ICONS.filter(icon =>
    icon.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCategoryIcon = CATEGORY_ICONS.find(icon => icon.name === selectedIcon);

  return (
    <div className="space-y-4">
      {/* Selected Icon Display */}
      {selectedCategoryIcon && (
        <div className="flex items-center gap-3 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
            <selectedCategoryIcon.icon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{selectedCategoryIcon.label}</p>
            <p className="text-xs text-gray-400">Current icon</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search icons..."
          className="w-full pl-9 pr-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Icon Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-80 overflow-y-auto p-1">
        {filteredIcons.map((icon) => {
          const Icon = icon.icon;
          const isSelected = selectedIcon === icon.name;

          return (
            <button
              key={icon.name}
              onClick={() => onSelect(icon.name)}
              className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-600 shadow-lg'
                  : 'bg-[#0a0e1a] border-gray-700 hover:border-blue-500/50'
              }`}
              title={icon.label}
            >
              <Icon
                className={`w-6 h-6 mx-auto ${
                  isSelected ? 'text-blue-400' : 'text-gray-400'
                }`}
              />
              <p
                className={`text-xs mt-2 text-center truncate ${
                  isSelected ? 'text-blue-400 font-medium' : 'text-gray-500'
                }`}
              >
                {icon.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* No Results */}
      {filteredIcons.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-400">No icons found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
