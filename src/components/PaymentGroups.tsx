import type { OutgoingPayment } from '@merit-systems/sdk'
import { useState } from 'react'
import { PaymentRow } from './PaymentRow'

interface PaymentGroupsProps {
  payments: OutgoingPayment[]
}

interface PaymentGroup {
  groupId: string | null
  payments: OutgoingPayment[]
  totalAmount: number
}

export function PaymentGroups({ payments }: PaymentGroupsProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }
  // Group payments by groupId
  const groupedPayments = payments.reduce(
    (groups, payment) => {
      const groupId = payment.group_id || null

      if (!groups[groupId || 'no-group']) {
        groups[groupId || 'no-group'] = {
          groupId,
          payments: [],
          totalAmount: 0,
        }
      }

      groups[groupId || 'no-group'].payments.push(payment)
      // Raw amount is in micro-units (divide by 1,000,000 to get dollars)
      const rawAmount = parseFloat(payment.amount.raw)
      const dollarAmount = rawAmount / 1000000

      groups[groupId || 'no-group'].totalAmount += dollarAmount

      return groups
    },
    {} as Record<string, PaymentGroup>
  )

  const groupEntries = Object.entries(groupedPayments)

  // Sort groups: grouped payments first (by timestamp of first payment), then individual payments
  groupEntries.sort(([aKey, aGroup], [bKey, bGroup]) => {
    // If one has a group and the other doesn't, prioritize the grouped one
    if (aKey !== 'no-group' && bKey === 'no-group') return -1
    if (aKey === 'no-group' && bKey !== 'no-group') return 1

    // Sort by the timestamp of the first payment in each group (most recent first)
    const aTimestamp = Math.max(
      ...aGroup.payments.map((p) => parseInt(p.timestamp))
    )
    const bTimestamp = Math.max(
      ...bGroup.payments.map((p) => parseInt(p.timestamp))
    )

    return bTimestamp - aTimestamp
  })

  return (
    <div className="space-y-6">
      {groupEntries.map(([groupKey, group]) => (
        <div key={groupKey}>
          {group.groupId && (
            <button
              onClick={() => toggleGroupCollapse(group.groupId!)}
              className="w-full mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {collapsedGroups.has(group.groupId) ? '▶' : '▼'}
                    </span>
                    <h4 className="font-medium text-sm text-gray-900">
                      Group Payment
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 font-mono ml-6">
                    ID: {group.groupId.substring(0, 12)}...
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    $
                    {group.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {group.payments.length} recipient
                    {group.payments.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </button>
          )}

          {(!group.groupId || !collapsedGroups.has(group.groupId)) && (
            <div
              className={`space-y-3 ${group.groupId ? 'ml-4 border-l-2 border-blue-200 pl-4' : ''}`}
            >
              {group.payments.map((payment, index) => (
                <PaymentRow
                  key={`${payment.tx_hash}-${index}`}
                  payment={payment}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
