import { useState } from 'react';
import { Store } from 'lucide-react';
import { getMerchantInfo, getMerchantInitials } from '../utils/merchantLogos';

interface MerchantIconProps {
  merchantName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MerchantIcon({ merchantName, size = 'md', className = '' }: MerchantIconProps) {
  const [imageError, setImageError] = useState(false);
  const merchantInfo = getMerchantInfo(merchantName);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // If logo exists and hasn't failed to load
  if (merchantInfo.logo && !imageError) {
    return (
      <div
        className={`${sizes[size]} rounded-lg overflow-hidden flex items-center justify-center bg-white ${className}`}
      >
        <img
          src={merchantInfo.logo}
          alt={merchantName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback to initials with colored background
  const initials = getMerchantInitials(merchantName);

  return (
    <div
      className={`${sizes[size]} rounded-lg flex items-center justify-center font-semibold ${className}`}
      style={{
        backgroundColor: `${merchantInfo.color}25`,
        color: merchantInfo.color,
      }}
    >
      {initials.length > 0 ? (
        <span>{initials}</span>
      ) : (
        <Store className={iconSizes[size]} />
      )}
    </div>
  );
}
