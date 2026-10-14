import { createContext } from 'react'
import type { SignInInput, SignUpInput, User } from '../types/user'

// What any page can get from the sign in state.
export interface AuthContextValue {
  user: User | null
  // true while we check if someone was already signed in
  loading: boolean
  isAdmin: boolean
  signIn: (input: SignInInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<void>
  signOut: () => Promise<void>
}

// Holds the sign in state. Pages read it with the useAuth hook.
export const AuthContext = createContext<AuthContextValue | null>(null)
