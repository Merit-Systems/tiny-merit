import type { MeritSDK } from '@merit-systems/sdk'
import { useMerit } from './use-merit'

// Hook to get just the SDK instance
export function useMeritSDK(): MeritSDK {
  const { sdk } = useMerit()
  return sdk
}
