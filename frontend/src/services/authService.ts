import type { SignInInput, SignUpInput, User } from '../types/user'
import { mockUsers, type MockUser } from './mockData'

const USERS_KEY = 'retain.users'
const SESSION_KEY = 'retain.session'

// Reads all the accounts from the browser's storage (mock only).
function getUsers(): MockUser[] {
  const saved = localStorage.getItem(USERS_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return mockUsers
}

// Saves all the accounts in the browser's storage (mock only).
function saveUsers(users: MockUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// copy the user without the password
function withoutPassword(user: MockUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

// Creates a new account and signs it in.
export async function signUp(input: SignUpInput): Promise<User> {
  const users = getUsers()
  const email = input.email.trim().toLowerCase()

  if (users.some((u) => u.email === email)) {
    throw new Error('An account with this email already exists')
  }

  const newUser: MockUser = {
    id: 'u' + Date.now(),
    name: input.name.trim(),
    email: email,
    password: input.password,
    role: 'user',
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])
  localStorage.setItem(SESSION_KEY, newUser.id)
  return withoutPassword(newUser)
}

// Checks the email and password, then signs the person in.
export async function signIn(input: SignInInput): Promise<User> {
  const email = input.email.trim().toLowerCase()
  const user = getUsers().find(
    (u) => u.email === email && u.password === input.password,
  )

  if (!user) {
    throw new Error('Incorrect email or password')
  }

  localStorage.setItem(SESSION_KEY, user.id)
  return withoutPassword(user)
}

// Forgets who was signed in.
export async function signOut() {
  localStorage.removeItem(SESSION_KEY)
}

// the other mock services use this to know whose data to return.
// the real backend reads this from the token instead.
export function getSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

// stops the call unless an admin is signed in. used by the admin services.
// the real backend checks the role from the token on every admin endpoint.
export function requireAdmin() {
  const user = getSessionUser()
  if (!user) {
    throw new Error('You need to sign in first')
  }
  if (user.role !== 'admin') {
    throw new Error('Only admins can do this')
  }
}

// every account, for the admin insights (mock only)
export function getAllUsers(): User[] {
  return getUsers().map(withoutPassword)
}

// same idea, but gives the whole user so services can check the role
export function getSessionUser(): User | null {
  const id = getSessionUserId()
  const user = getUsers().find((u) => u.id === id)
  return user ? withoutPassword(user) : null
}

// checks if someone was already signed in when the page loaded
export async function getCurrentUser(): Promise<User | null> {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    return null
  }

  const user = getUsers().find((u) => u.id === id)
  if (!user) {
    return null
  }
  return withoutPassword(user)
}
