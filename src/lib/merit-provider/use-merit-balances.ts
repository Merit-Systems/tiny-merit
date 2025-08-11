import { useMemo } from 'react'
import { useMerit } from './context'

// Hook for balance operations
export function useMeritBalances() {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      getBalanceByLogin: sdk.balances.getBalanceByLogin.bind(sdk.balances),
    }),
    [sdk]
  )
}
