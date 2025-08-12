import { useState } from 'react'
import type { GitHubUserData } from '../types'
import { UserPaymentsSection } from './UserPaymentsSection'
import { UserSettings } from './UserSettings'

export function PaymentHistoryTab() {
  const [selectedUser, setSelectedUser] = useState<GitHubUserData | null>(null)

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        <p className="text-gray-600 text-sm">
          View your Merit balance and recent payment activity.
        </p>
      </div>

      <div className="flex-1 min-h-0 space-y-4">
        <UserSettings onUserChange={setSelectedUser} />

        {selectedUser && <UserPaymentsSection githubUser={selectedUser} />}
      </div>
    </div>
  )
}
