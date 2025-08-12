import { useMemo } from 'react'
import { useMerit } from './use-merit'

// Hook for basic checkout operations
export function useMeritCheckout() {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      generateCheckoutUrl: (
        params: Parameters<typeof sdk.checkout.generateCheckoutUrl>[0]
      ) => sdk.checkout.generateCheckoutUrl(params),
      generateGroupId: () => sdk.checkout.generateGroupId(),
    }),
    [sdk]
  )
}
