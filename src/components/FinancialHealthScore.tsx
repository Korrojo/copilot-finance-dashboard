import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useFinancialHealth } from '../hooks/useFinancialHealth';
import { formatCurrency } from '../utils/formatCurrency';

interface HealthMetric {
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendation?: string;
}

const STATUS_CONFIG = {
  excellent: { color: 'text-green-400', bg: 'bg-green-500', label: 'Excellent' },
  good: { color: 'text-blue-400', bg: 'bg-blue-500', label: 'Good' },
  fair: { color: 'text-yellow-400', bg: 'bg-yellow-500', label: 'Fair' },
  poor: { color: 'text-red-400', bg: 'bg-red-500', label: 'Poor' },
};

export function FinancialHealthScore() {
  const healthData = useFinancialHealth();

  // Extract calculated metrics
  const {
    savingsRate,
    emergencyFundMonths,
    totalDebt,
    creditUtilization,
    onTimePaymentRate,
  } = healthData;

  // Calculate individual metric scores
  const metrics: HealthMetric[] = [
    {
      name: 'Savings Rate',
      score: Math.min(savingsRate * 5, 25), // Max 25 points (20% savings = max)
      maxScore: 25,
      status: savingsRate >= 20 ? 'excellent' : savingsRate >= 15 ? 'good' : savingsRate >= 10 ? 'fair' : 'poor',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income`,
      recommendation: savingsRate < 20 ? 'Aim for at least 20% savings rate' : undefined,
    },
    {
      name: 'Emergency Fund',
      score: Math.min(emergencyFundMonths * 3.33, 20), // Max 20 points (6 months = max)
      maxScore: 20,
      status: emergencyFundMonths >= 6 ? 'excellent' : emergencyFundMonths >= 3 ? 'good' : emergencyFundMonths >= 1 ? 'fair' : 'poor',
      description: `${emergencyFundMonths.toFixed(1)} months of expenses saved`,
      recommendation: emergencyFundMonths < 6 ? 'Build up to 6 months of expenses' : undefined,
    },
    {
      name: 'Debt Management',
      score: totalDebt < 5000 ? 20 : totalDebt < 10000 ? 15 : totalDebt < 20000 ? 10 : 5,
      maxScore: 20,
      status: totalDebt < 5000 ? 'excellent' : totalDebt < 10000 ? 'good' : totalDebt < 20000 ? 'fair' : 'poor',
      description: `${formatCurrency(totalDebt)} total debt`,
      recommendation: totalDebt > 5000 ? 'Focus on paying down high-interest debt' : undefined,
    },
    {
      name: 'Credit Utilization',
      score: creditUtilization < 10 ? 15 : creditUtilization < 30 ? 12 : creditUtilization < 50 ? 8 : 4,
      maxScore: 15,
      status: creditUtilization < 10 ? 'excellent' : creditUtilization < 30 ? 'good' : creditUtilization < 50 ? 'fair' : 'poor',
      description: `${creditUtilization}% of available credit used`,
      recommendation: creditUtilization > 30 ? 'Keep credit utilization below 30%' : undefined,
    },
    {
      name: 'Payment History',
      score: onTimePaymentRate >= 98 ? 20 : onTimePaymentRate >= 95 ? 15 : onTimePaymentRate >= 90 ? 10 : 5,
      maxScore: 20,
      status: onTimePaymentRate >= 98 ? 'excellent' : onTimePaymentRate >= 95 ? 'good' : onTimePaymentRate >= 90 ? 'fair' : 'poor',
      description: `${onTimePaymentRate.toFixed(0)}% on-time payments`,
      recommendation: onTimePaymentRate < 100 ? 'Set up automatic payments to avoid missed payments' : undefined,
    },
  ];

  const totalScore = metrics.reduce((sum, m) => sum + m.score, 0);
  const maxTotalScore = metrics.reduce((sum, m) => sum + m.maxScore, 0);
  const healthPercentage = (totalScore / maxTotalScore) * 100;

  const overallStatus: 'excellent' | 'good' | 'fair' | 'poor' =
    healthPercentage >= 80 ? 'excellent' :
    healthPercentage >= 60 ? 'good' :
    healthPercentage >= 40 ? 'fair' : 'poor';

  const statusConfig = STATUS_CONFIG[overallStatus];

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Financial Health Score</h3>
      </div>

      {/* Overall Score - Compact Horizontal Layout */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-700">
        {/* Smaller Gauge */}
        <div className="relative flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke="#1f2937"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="56"
              cy="56"
              r="50"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - healthPercentage / 100)}`}
              className={statusConfig.color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-3xl font-bold text-white">{Math.round(totalScore)}</p>
            <p className="text-xs text-gray-400">of {maxTotalScore}</p>
          </div>
        </div>

        {/* Score Info */}
        <div className="flex-1">
          <div className={`inline-block px-3 py-1 rounded-full ${statusConfig.bg} bg-opacity-20 border border-current ${statusConfig.color} mb-2`}>
            <span className="text-sm font-semibold">{statusConfig.label}</span>
          </div>
          <p className="text-sm text-gray-400">
            {overallStatus === 'excellent' && 'Your financial health is outstanding! Keep it up.'}
            {overallStatus === 'good' && 'You\'re doing well! A few improvements can make it excellent.'}
            {overallStatus === 'fair' && 'Room for improvement. Focus on key areas below.'}
            {overallStatus === 'poor' && 'Needs attention. Follow recommendations to improve.'}
          </p>
        </div>
      </div>

      {/* Individual Metrics - 2 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {metrics.map((metric) => {
          const metricStatus = STATUS_CONFIG[metric.status];
          const metricPercentage = (metric.score / metric.maxScore) * 100;

          return (
            <div key={metric.name} className="bg-[#0a0e1a] rounded-lg p-3 border border-gray-700">
              {/* Compact Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {metric.status === 'excellent' || metric.status === 'good' ? (
                    <CheckCircle className={`w-3.5 h-3.5 ${metricStatus.color}`} />
                  ) : (
                    <AlertCircle className={`w-3.5 h-3.5 ${metricStatus.color}`} />
                  )}
                  <h4 className="text-sm font-semibold text-white">{metric.name}</h4>
                </div>
                <span className={`text-xs font-semibold ${metricStatus.color}`}>
                  {metric.score.toFixed(0)}/{metric.maxScore}
                </span>
              </div>

              {/* Description + Progress Bar in one line */}
              <div className="mb-1">
                <p className="text-xs text-gray-400 mb-1.5">{metric.description}</p>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metricStatus.bg} transition-all duration-500`}
                    style={{ width: `${metricPercentage}%` }}
                  />
                </div>
              </div>

              {/* Compact Recommendation */}
              {metric.recommendation && (
                <p className="text-xs text-blue-400 mt-1.5">
                  💡 {metric.recommendation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact Action Items */}
      {metrics.filter(m => m.recommendation).length > 0 && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h5 className="text-xs font-semibold text-blue-400 mb-1.5">Quick Actions to Improve Score</h5>
          <ul className="space-y-0.5 text-xs text-gray-300">
            {metrics
              .filter(m => m.recommendation)
              .slice(0, 3)
              .map((m, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-400 text-xs">•</span>
                  <span>{m.recommendation}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
