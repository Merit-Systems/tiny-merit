import type { MeritSDKConfig } from '@merit-systems/sdk'
import { MeritSDK } from '@merit-systems/sdk'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'

// Context type
export interface MeritContextType {
  sdk: MeritSDK
  config: MeritSDKConfig
}

// Create the context
export const MeritContext = createContext<MeritContextType | null>(null)

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
        (import.meta.env.DEV ? '/api' : 'https://api.merit.systems'), // Use proxy in development
      checkoutURL:
        config.checkoutURL ||
        import.meta.env.VITE_MERIT_CHECKOUT_URL ||
        'https://terminal.merit.systems/checkout',
    }),
    [config.apiKey, config.baseURL, config.checkoutURL]
  )

  const sdk = useMemo(() => {
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

// Base hook to use the Merit context
export function useMerit(): MeritContextType {
  const context = useContext(MeritContext)

  if (!context) {
    throw new Error('useMerit must be used within a MeritProvider')
  }

  return context
}
