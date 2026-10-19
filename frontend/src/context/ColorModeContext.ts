import { createContext } from 'react'
import type { ColorMode } from '../theme/theme'

// What any component can get about light and dark mode.
export interface ColorModeContextValue {
  mode: ColorMode
  toggleMode: () => void
}

// Holds the chosen mode. Components read it with the useColorMode hook.
export const ColorModeContext = createContext<ColorModeContextValue | null>(null)
