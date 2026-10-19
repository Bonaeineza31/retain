import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useMemo, useState, type ReactNode } from 'react'
import { createAppTheme, type ColorMode } from '../theme/theme'
import { ColorModeContext } from './ColorModeContext'

// the name the choice is saved under in the browser
const STORAGE_KEY = 'retain.colorMode'

// the saved choice. when there is none, the mode the device is set to
function getStartingMode(): ColorMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // the browser does not let us read saved things, so we go on without
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Gives the whole app the theme, and a way to switch between light and dark.
export default function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(getStartingMode)

  const theme = useMemo(() => createAppTheme(mode), [mode])

  function toggleMode() {
    const next = mode === 'light' ? 'dark' : 'light'
    setMode(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // the choice still works, it just will not be remembered
    }
  }

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {/* enableColorScheme also darkens the browser's own parts, like the date picker and scrollbars */}
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
