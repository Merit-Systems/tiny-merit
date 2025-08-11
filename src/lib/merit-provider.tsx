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
      checkoutURL:
        config.checkoutURL ||
        import.meta.env.VITE_MERIT_CHECKOUT_URL ||
        'https://terminal.merit.systems/checkout',
    }),
    [config.apiKey, config.baseURL, config.checkoutURL]
  )

  const sdk = useMemo(() => {
    console.log('Creating Merit SDK with config:', meritConfig)
    return new MeritSDK(meritConfig)
  }, [meritConfig])

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
      generateCheckoutUrl: (
        params: Parameters<typeof sdk.checkout.generateCheckoutUrl>[0]
      ) => sdk.checkout.generateCheckoutUrl(params),
      generateGroupId: () => sdk.checkout.generateGroupId(),
    }),
    [sdk]
  )
}
