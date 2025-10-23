import { FinancialHealthScore } from '../components/FinancialHealthScore';
import { SpendingInsights } from '../components/SpendingInsights';
import { SpendingPredictions } from '../components/SpendingPredictions';
import { GoalProgressTracker } from '../components/GoalProgressTracker';
import { BillNegotiationReminders } from '../components/BillNegotiationReminders';
import { TaxCategoryTracker } from '../components/TaxCategoryTracker';
import { CustomFinancialReport } from '../components/CustomFinancialReport';
import { DataExportImport } from '../components/DataExportImport';

export function Insights() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Insights & Analytics</h1>
        <p className="text-gray-400">
          AI-powered insights, predictions, and advanced financial tools
        </p>
      </div>

      {/* Financial Health Score - Full Width */}
      <div className="mb-8">
        <FinancialHealthScore />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Spending Predictions */}
        <SpendingPredictions />

        {/* AI Insights */}
        <SpendingInsights />
      </div>

      {/* Goals and Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GoalProgressTracker />
        <BillNegotiationReminders />
      </div>

      {/* Tax and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TaxCategoryTracker />
        <CustomFinancialReport />
      </div>

      {/* Data Management */}
      <div className="mb-8">
        <DataExportImport />
      </div>
    </div>
  );
}
