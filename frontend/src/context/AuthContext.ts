import { createContext } from 'react'
import type { SignInInput, SignUpInput, User } from '../types/user'

export interface AuthContextValue {
  user: User | null
  // true while we check if someone was already signed in
  loading: boolean
  isAdmin: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
