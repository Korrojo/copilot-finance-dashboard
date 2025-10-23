import { CreditCard, Building2, TrendingUp, Check } from 'lucide-react';
import type { Account } from '../types';

interface AccountSelectorProps {
  selectedAccount?: string;
  accounts: Account[];
  onSelect: (accountName: string) => void;
  showBalance?: boolean;
}

const INSTITUTION_COLORS: Record<string, string> = {
  chase: '#0070D1',
  bofa: '#D50032',
  'bank of america': '#D50032',
  wells: '#D71E28',
  'wells fargo': '#D71E28',
  citi: '#056DAE',
  capital: '#004879',
  'capital one': '#004879',
  amex: '#006FCF',
  'american express': '#006FCF',
  discover: '#FF6000',
  fidelity: '#00754A',
  vanguard: '#B80002',
  schwab: '#00A0DF',
  default: '#3B82F6',
};

function getInstitutionColor(institution: string): string {
  const key = institution.toLowerCase();
  for (const [name, color] of Object.entries(INSTITUTION_COLORS)) {
    if (key.includes(name)) {
      return color;
    }
  }
  return INSTITUTION_COLORS.default;
}

function getAccountTypeIcon(type: Account['type']) {
  switch (type) {
    case 'credit':
      return CreditCard;
    case 'debit':
      return Building2;
    case 'investment':
      return TrendingUp;
    default:
      return CreditCard;
  }
}

function getAccountTypeBadge(type: Account['type']): {
  label: string;
  color: string;
} {
  switch (type) {
    case 'credit':
      return { label: 'Credit', color: '#EF4444' };
    case 'debit':
      return { label: 'Checking', color: '#10B981' };
    case 'investment':
      return { label: 'Investment', color: '#8B5CF6' };
    default:
      return { label: 'Account', color: '#6B7280' };
  }
}

export function AccountSelector({
  selectedAccount,
  accounts,
  onSelect,
  showBalance = false,
}: AccountSelectorProps) {
  const selectedAcc = accounts.find(a => a.name === selectedAccount);

  return (
    <div className="space-y-3">
      {/* Selected Account Display */}
      {selectedAcc && (
        <div
          className="p-3 rounded-lg border-2"
          style={{
            borderColor: getInstitutionColor(selectedAcc.institution),
            backgroundColor: `${getInstitutionColor(selectedAcc.institution)}15`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${getInstitutionColor(selectedAcc.institution)}30`,
              }}
            >
              {(() => {
                const Icon = getAccountTypeIcon(selectedAcc.type);
                return (
                  <Icon
                    className="w-5 h-5"
                    style={{ color: getInstitutionColor(selectedAcc.institution) }}
                  />
                );
              })()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{selectedAcc.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{selectedAcc.institution}</span>
                {selectedAcc.mask && (
                  <>
                    <span>•</span>
                    <span>••{selectedAcc.mask}</span>
                  </>
                )}
              </div>
            </div>
            {showBalance && (
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  ${selectedAcc.balance.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Selection List */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {selectedAcc ? 'Change Account' : 'Select Account'}
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {accounts.map((account) => {
            const Icon = getAccountTypeIcon(account.type);
            const typeBadge = getAccountTypeBadge(account.type);
            const isSelected = selectedAccount === account.name;
            const institutionColor = getInstitutionColor(account.institution);

            return (
              <button
                key={account.id}
                onClick={() => onSelect(account.name)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700 bg-[#0a0e1a] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${institutionColor}20`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: institutionColor }} />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{account.name}</p>
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${typeBadge.color}20`,
                          color: typeBadge.color,
                        }}
                      >
                        {typeBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{account.institution}</span>
                      {account.mask && (
                        <>
                          <span>•</span>
                          <span>••{account.mask}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {showBalance && (
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-white">
                        ${account.balance.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* No Accounts Message */}
      {accounts.length === 0 && (
        <div className="p-4 bg-[#0a0e1a] border border-gray-700 rounded-lg text-center">
          <Building2 className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No accounts available</p>
        </div>
      )}
    </div>
  );
}
