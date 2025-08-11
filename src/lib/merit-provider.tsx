import type { MeritSDKConfig } from '@rsproule/merit-sdk-test'
import { MeritSDK } from '@rsproule/merit-sdk-test'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

// Context type
interface MeritContextType {
  sdk: MeritSDK
  config: MeritSDKConfig
}

// Create the context
const MeritContext = createContext<MeritContextType | null>(null)

// Provider props
interface MeritProviderProps {
  children: ReactNode
  config?: Partial<MeritSDKConfig>
}

// Provider component
export function MeritProvider({ children, config = {} }: MeritProviderProps) {
  const meritConfig: MeritSDKConfig = useMemo(
    () => ({
      apiKey:
        config.apiKey || import.meta.env.VITE_MERIT_API_KEY || 'your-api-key',
      baseURL:
        config.baseURL ||
        import.meta.env.VITE_MERIT_BASE_URL ||
        'https://api.merit.systems',
    }),
    [config.apiKey, config.baseURL]
  )

  const sdk = useMemo(() => new MeritSDK(meritConfig), [meritConfig])

  const contextValue = useMemo(
    () => ({
      sdk,
      config: meritConfig,
    }),
    [sdk, meritConfig]
  )

  return (
    <MeritContext.Provider value={contextValue}>
      {children}
    </MeritContext.Provider>
  )
}

// Hook to use the Merit SDK
export function useMerit(): MeritContextType {
  const context = useContext(MeritContext)

  if (!context) {
    throw new Error('useMerit must be used within a MeritProvider')
  }

  return context
}

// Hook to get just the SDK instance
export function useMeritSDK(): MeritSDK {
  const { sdk } = useMerit()
  return sdk
}

// Hook for checkout operations
export function useMeritCheckout() {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      generateCheckoutUrl: sdk.checkout.generateCheckoutUrl.bind(sdk.checkout),
      generateGroupId: sdk.checkout.generateGroupId.bind(sdk.checkout),
    }),
    [sdk]
  )
}

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

// Hook for payment operations
export function useMeritPayments() {
  const { sdk } = useMerit()

  return useMemo(
    () => ({
      getPaymentsBySender: sdk.payments.getPaymentsBySender.bind(sdk.payments),
      getPaymentsByReceiver: sdk.payments.getPaymentsByReceiver.bind(
        sdk.payments
      ),
    }),
    [sdk]
  )
}
