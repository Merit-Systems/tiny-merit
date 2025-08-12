import { useMemo } from 'react'
import { useMerit } from './use-merit'

// Hook for balance operations
export function useMeritBalances() {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      getUserBalanceByLogin: sdk.balances.getUserBalanceByLogin.bind(
        sdk.balances
      ),
      getUserBalanceByGithubId: sdk.balances.getUserBalanceByGithubId.bind(
        sdk.balances
      ),
      getRepoBalanceByName: sdk.balances.getRepoBalanceByName.bind(
        sdk.balances
      ),
      getRepoBalanceByRepoId: sdk.balances.getRepoBalanceByRepoId.bind(
        sdk.balances
      ),
    }),
    [sdk]
  )
}
