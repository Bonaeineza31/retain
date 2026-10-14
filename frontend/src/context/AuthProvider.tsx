import { useEffect, useState, type ReactNode } from 'react'
import * as authService from '../services/authService'
import type { SignInInput, SignUpInput, User } from '../types/user'
import { AuthContext } from './AuthContext'

interface Props {
  children: ReactNode
}

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // when the app opens, restore the session if there is one
  useEffect(() => {
    authService.getCurrentUser().then((current) => {
      setUser(current)
      setLoading(false)
    })
  }, [])

  async function signIn(input: SignInInput) {
    const signedIn = await authService.signIn(input)
    setUser(signedIn)
  }

  async function signUp(input: SignUpInput) {
    const created = await authService.signUp(input)
    setUser(created)
  }

  async function signOut() {
    await authService.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
