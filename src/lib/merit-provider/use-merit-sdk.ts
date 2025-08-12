import type { MeritSDK } from '@merit-systems/sdk'
import { useMerit } from './context'

// Hook to get just the SDK instance
export function useMeritSDK(): MeritSDK {
  const { sdk } = useMerit()
  return sdk
}
