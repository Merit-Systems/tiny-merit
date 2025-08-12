import { UserPaymentsSection } from './UserPaymentsSection'

export function PaymentHistoryTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        <p className="text-gray-600 text-sm">
          View your Merit balance and recent payment activity.
        </p>
      </div>

      <UserPaymentsSection />
    </div>
  )
}
