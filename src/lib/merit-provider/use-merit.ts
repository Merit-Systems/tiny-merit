import { useContext } from 'react'
import { MeritContext } from './merit-context'
import type { MeritContextType } from './types'

// Hook to use the Merit context
export function useMerit(): MeritContextType {
  const context = useContext(MeritContext)

  if (!context) {
    throw new Error('useMerit must be used within a MeritProvider')
  }

  return context
}
