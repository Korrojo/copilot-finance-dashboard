import { AlertCircle, CheckCircle, Info, Lightbulb, TrendingUp } from 'lucide-react';
import { useSpendingInsights } from '../hooks/useSpendingInsights';

const INSIGHT_ICONS = {
  warning: AlertCircle,
  success: CheckCircle,
  info: Info,
  tip: Lightbulb,
};

const INSIGHT_COLORS = {
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: 'text-yellow-400',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-400',
    icon: 'text-green-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: 'text-blue-400',
  },
  tip: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    icon: 'text-purple-400',
  },
};

const IMPACT_BADGES = {
  high: { label: 'High Impact', color: 'bg-red-500/20 text-red-400' },
  medium: { label: 'Medium Impact', color: 'bg-yellow-500/20 text-yellow-400' },
  low: { label: 'Low Impact', color: 'bg-gray-500/20 text-gray-400' },
};

export function SpendingInsights() {
  const insights = useSpendingInsights();

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">AI-Powered Spending Insights</h3>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Smart analysis of your spending patterns with actionable recommendations
      </p>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-400">No insights at the moment. Keep tracking your expenses!</p>
          </div>
        ) : (
          insights.map((insight) => {
            const Icon = INSIGHT_ICONS[insight.type];
            const colors = INSIGHT_COLORS[insight.type];

            return (
              <div
                key={insight.id}
                className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${colors.icon} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${colors.text}`}>{insight.title}</h4>
                      {insight.impact && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${IMPACT_BADGES[insight.impact].color}`}>
                          {IMPACT_BADGES[insight.impact].label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                    {insight.action && (
                      <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
