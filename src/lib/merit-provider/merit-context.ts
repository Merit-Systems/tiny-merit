import { createContext } from 'react'
import type { MeritContextType } from './types'

export const MeritContext = createContext<MeritContextType | undefined>(
  undefined
)
