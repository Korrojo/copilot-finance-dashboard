/**
 * Skeleton loader for transaction list
 */
export function TransactionSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Month Header Skeleton */}
      <div className="mb-4">
        <div className="h-6 w-32 bg-gray-700 rounded"></div>
      </div>

      {/* Transaction Rows Skeleton */}
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-[#0a0e1a] border border-gray-800 rounded-lg"
          >
            {/* Checkbox Skeleton */}
            <div className="w-4 h-4 bg-gray-700 rounded"></div>

            {/* Merchant Icon Skeleton */}
            <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>

            {/* Merchant & Category Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-700 rounded"></div>
              <div className="h-3 w-24 bg-gray-700 rounded"></div>
            </div>

            {/* Amount Skeleton */}
            <div className="w-24 text-right">
              <div className="h-5 bg-gray-700 rounded ml-auto"></div>
            </div>

            {/* Date Skeleton */}
            <div className="w-20">
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>

            {/* Account Skeleton */}
            <div className="w-32">
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>

            {/* Status Skeleton */}
            <div className="w-20">
              <div className="h-6 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for transaction detail panel
 */
export function TransactionDetailSkeleton() {
  return (
    <div className="animate-pulse p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-700 rounded-lg"></div>
      </div>

      {/* Amount Skeleton */}
      <div className="p-4 bg-[#0a0e1a] rounded-lg">
        <div className="h-8 w-32 bg-gray-700 rounded"></div>
      </div>

      {/* Fields Skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Notes Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-gray-700 rounded"></div>
        <div className="h-24 bg-gray-700 rounded-lg"></div>
      </div>

      {/* Tags Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-12 bg-gray-700 rounded"></div>
        <div className="flex gap-2">
          <div className="h-7 w-20 bg-gray-700 rounded-full"></div>
          <div className="h-7 w-24 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for modal content
 */
export function ModalSkeleton() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      {/* Title */}
      <div className="h-6 w-48 bg-gray-700 rounded"></div>

      {/* Form Fields */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded-lg"></div>
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <div className="h-10 flex-1 bg-gray-700 rounded-lg"></div>
        <div className="h-10 flex-1 bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}
