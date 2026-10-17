import type { SignInInput, SignUpInput, User } from '../types/user'
import { ApiError, clearToken, getToken, request, saveToken } from './api'

// what the backend gives back after sign up and sign in
interface AuthResult {
  user: User
  token: string
}

// Creates a new account and signs it in.
export async function signUp(input: SignUpInput): Promise<User> {
  const result = await request<AuthResult>('/api/auth/register', {
    method: 'POST',
    body: input,
  })
  saveToken(result.token)
  return result.user
}

// Checks the email and password, then signs the person in.
export async function signIn(input: SignInInput): Promise<User> {
  const result = await request<AuthResult>('/api/auth/login', {
    method: 'POST',
    body: input,
  })
  saveToken(result.token)
  return result.user
}

// Forgets the login token.
export async function signOut() {
  clearToken()
}

// Asks the backend who is signed in. Gives null when there is no token or it is no longer valid.
export async function getCurrentUser(): Promise<User | null> {
  if (!getToken()) {
    return null
  }

  try {
    return await request<User>('/api/auth/me')
  } catch (error) {
    // the token expired or the account is gone
    if (error instanceof ApiError && error.status === 401) {
      clearToken()
      return null
    }
    throw error
  }
}
