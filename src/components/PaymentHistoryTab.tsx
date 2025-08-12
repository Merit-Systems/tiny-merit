import { UserPaymentsSection } from './UserPaymentsSection'

export function PaymentHistoryTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        <p className="text-gray-600 text-sm">
          View your Merit balance and recent payment activity.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <UserPaymentsSection />
      </div>
    </div>
  )
}
