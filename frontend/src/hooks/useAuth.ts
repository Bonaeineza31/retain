import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// A shortcut to read the sign in state inside any component.
export default function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
