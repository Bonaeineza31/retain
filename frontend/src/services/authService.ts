import type { SignInInput, SignUpInput, User } from '../types/user'
import { mockUsers, type MockUser } from './mockData'

const USERS_KEY = 'retain.users'
const SESSION_KEY = 'retain.session'

function getUsers(): MockUser[] {
  const saved = localStorage.getItem(USERS_KEY)
  if (saved) {
    return JSON.parse(saved)
  }
  return mockUsers
}

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

export async function signOut() {
  localStorage.removeItem(SESSION_KEY)
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
