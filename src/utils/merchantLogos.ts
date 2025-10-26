/**
 * Merchant logo mapping and utilities
 * In a production app, this would integrate with Plaid, Clearbit, or similar services
 */

export interface MerchantInfo {
  name: string;
  logo?: string;
  color: string;
  category?: string;
}

// Common merchant colors (brand colors)
const MERCHANT_COLORS: Record<string, string> = {
  amazon: '#FF9900',
  walmart: '#0071CE',
  target: '#CC0000',
  costco: '#0080CE',
  starbucks: '#00704A',
  'dunkin': '#DD0031',
  'chick-fil-a': '#DD0031',
  mcdonalds: '#FFC72C',
  netflix: '#E50914',
  spotify: '#1DB954',
  apple: '#555555',
  google: '#4285F4',
  microsoft: '#00A4EF',
  uber: '#000000',
  lyft: '#FF00BF',
  airbnb: '#FF5A5F',
  doordash: '#FF3008',
  instacart: '#43B02A',
  whole: '#00674B',
  kroger: '#2574BC',
  safeway: '#DD0031',
  shell: '#FBCE07',
  chevron: '#E31E27',
  exxon: '#DC143C',
  '76': '#DC1E35',
  bp: '#00833E',
  verizon: '#CD040B',
  att: '#00A8E0',
  tmobile: '#E20074',
  comcast: '#000000',
  spectrum: '#0E5CA0',
  delta: '#003A70',
  southwest: '#304CB2',
  united: '#003B6F',
  american: '#0078D2',
  marriott: '#A80532',
  hilton: '#0057A0',
  hyatt: '#E21C29',
  ihg: '#003545',
  cvs: '#CC0000',
  walgreens: '#E31837',
  riteaid: '#063D96',
};

// Fallback colors for merchants without defined colors
const FALLBACK_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
];

/**
 * Get merchant color from name
 */
export function getMerchantColor(merchantName: string): string {
  const normalizedName = merchantName.toLowerCase();

  // Check for exact or partial match in known merchants
  for (const [key, color] of Object.entries(MERCHANT_COLORS)) {
    if (normalizedName.includes(key)) {
      return color;
    }
  }

  // Generate consistent color based on merchant name hash
  let hash = 0;
  for (let i = 0; i < merchantName.length; i++) {
    hash = merchantName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[index];
}

/**
 * Get merchant initials from name
 */
export function getMerchantInitials(merchantName: string): string {
  const words = merchantName.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word - take first 2 characters
    return merchantName.substring(0, 2).toUpperCase();
  }

  // Multiple words - take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Get merchant logo URL (if available)
 * In production, this would call an API like Clearbit Logo API
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getMerchantLogoUrl(_merchantName: string): string | null {
  // For now, return null - in production, implement API call
  // Example: `https://logo.clearbit.com/${domain}`
  return null;
}

/**
 * Get merchant information
 */
export function getMerchantInfo(merchantName: string): MerchantInfo {
  const logoUrl = getMerchantLogoUrl(merchantName);
  return {
    name: merchantName,
    logo: logoUrl !== null ? logoUrl : undefined,
    color: getMerchantColor(merchantName),
  };
}

/**
 * Check if merchant logo is available
 */
export function hasMerchantLogo(_merchantName: string): boolean {
  // For now, no logos are available - in production, check API
  return false;
}
