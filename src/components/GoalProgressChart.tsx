import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Goal } from '../types/goal';
import { formatCompactCurrency } from '../utils/formatCurrency';

interface GoalProgressChartProps {
  goal: Goal;
}

export function GoalProgressChart({ goal }: GoalProgressChartProps) {
  // Generate projection data
  const data = generateProjectionData(goal);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#374151"
            style={{ fontSize: '11px' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#374151"
            style={{ fontSize: '11px' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompactCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1f2e',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => formatCompactCurrency(value)}
          />
          <ReferenceLine
            y={goal.target}
            stroke="#10b981"
            strokeDasharray="3 3"
            label={{ value: 'Target', position: 'right', fill: '#10b981', fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            fill="url(#actualGradient)"
            animationDuration={500}
          />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            fill="url(#projectionGradient)"
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function generateProjectionData(goal: Goal) {
  const startDate = new Date(goal.startDate);
  const targetDate = new Date(goal.targetDate);
  const now = new Date();

  const data: Array<{ date: string; actual?: number; projected?: number }> = [];

  // Generate actual progress (past months)
  const monthsPassed = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  for (let i = 0; i <= monthsPassed && i <= 24; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    const progress = (goal.current / monthsPassed) * i;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      actual: Math.min(progress, goal.current),
      projected: undefined,
    });
  }

  // Generate projection (future months)
  const totalMonths = Math.floor(
    (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  for (let i = monthsPassed + 1; i <= totalMonths && i <= 36; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    const projectedValue = goal.current + (goal.requiredMonthlyAmount * (i - monthsPassed));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      actual: undefined,
      projected: Math.min(projectedValue, goal.target),
    });
  }

  // Ensure smooth transition between actual and projected
  if (data.length > 0 && monthsPassed >= 0 && monthsPassed < data.length) {
    data[monthsPassed].projected = goal.current;
  }

  return data;
}
