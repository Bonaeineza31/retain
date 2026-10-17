// What a person is allowed to do: a normal user or an admin.
export type UserRole = 'user' | 'admin'

// A person with an account. It never includes the password.
export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

// What the sign up form sends.
export interface SignUpInput {
  name: string
  email: string
  password: string
}

// What the sign in form sends.
export interface SignInInput {
  email: string
  password: string
}
