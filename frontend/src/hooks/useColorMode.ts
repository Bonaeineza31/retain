import { useContext } from 'react'
import { ColorModeContext } from '../context/ColorModeContext'

// A shortcut to read the light or dark mode inside any component.
export default function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used inside ColorModeProvider')
  }
  return context
}
