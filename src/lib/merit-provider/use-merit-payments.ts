import { useMemo } from 'react'
import { useMerit } from './context'

// Hook for payment operations
export function useMeritPayments() {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      getPaymentsBySender: sdk.payments.getPaymentsBySender.bind(sdk.payments),
    }),
    [sdk]
  )
}
