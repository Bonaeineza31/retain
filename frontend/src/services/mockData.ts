import type { Budget } from '../types/budget'
import type { Category } from '../types/category'
import type { Expense } from '../types/expense'
import type { User } from '../types/user'

// Mock only: the real backend will never expose passwords.
export interface MockUser extends User {
  password: string
}

// Sample accounts for trying the app. The real database replaces them later.
export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    name: 'Aline Uwase',
    email: 'aline@retain.rw',
    password: 'password123',
    role: 'user',
    createdAt: '2026-08-12T09:30:00Z',
  },
  {
    id: 'u2',
    name: 'Eric Mugisha',
    email: 'eric@retain.rw',
    password: 'password123',
    role: 'user',
    createdAt: '2026-09-03T14:10:00Z',
  },
  {
    id: 'u3',
    name: 'Admin',
    email: 'admin@retain.rw',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-08-01T08:00:00Z',
  },
]

// Sample categories. The first one is the default.
export const mockCategories: Category[] = [
  { id: 'c0', name: 'Uncategorized', isDefault: true, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c1', name: 'Food', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c2', name: 'Transport', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c3', name: 'Rent', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c4', name: 'Airtime & Data', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c5', name: 'Health', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c6', name: 'Entertainment', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
  { id: 'c7', name: 'Education', isDefault: false, createdAt: '2026-08-01T08:00:00Z' },
]

// Sample expenses for September and October 2026.
export const mockExpenses: Expense[] = [
  { id: 'e1', userId: 'u1', title: 'Monthly rent', amount: 150000, categoryId: 'c3', date: '2026-10-01', paymentMethod: 'bank transfer', createdAt: '2026-10-01T07:00:00Z' },
  { id: 'e2', userId: 'u1', title: 'Market vegetables', amount: 12500, categoryId: 'c1', date: '2026-10-02', paymentMethod: 'cash', notes: 'Kimironko market', createdAt: '2026-10-02T10:15:00Z' },
  { id: 'e3', userId: 'u1', title: 'Moto to town', amount: 2000, categoryId: 'c2', date: '2026-10-03', paymentMethod: 'mobile money', createdAt: '2026-10-03T06:50:00Z' },
  { id: 'e4', userId: 'u1', title: 'Airtime top-up', amount: 5000, categoryId: 'c4', date: '2026-10-04', paymentMethod: 'mobile money', createdAt: '2026-10-04T12:00:00Z' },
  { id: 'e5', userId: 'u1', title: 'Lunch with colleagues', amount: 8000, categoryId: 'c1', date: '2026-10-06', paymentMethod: 'card', createdAt: '2026-10-06T13:20:00Z' },
  { id: 'e6', userId: 'u1', title: 'Pharmacy', amount: 6500, categoryId: 'c5', date: '2026-10-08', paymentMethod: 'cash', notes: 'Malaria test and tablets', createdAt: '2026-10-08T16:40:00Z' },
  { id: 'e7', userId: 'u1', title: 'Cinema tickets', amount: 10000, categoryId: 'c6', date: '2026-10-10', paymentMethod: 'mobile money', createdAt: '2026-10-10T19:00:00Z' },
  { id: 'e8', userId: 'u1', title: 'Online course', amount: 25000, categoryId: 'c7', date: '2026-10-12', paymentMethod: 'card', createdAt: '2026-10-12T09:05:00Z' },
  { id: 'e9', userId: 'u1', title: 'Gift for a friend', amount: 7000, categoryId: 'c0', date: '2026-10-13', paymentMethod: 'cash', createdAt: '2026-10-13T15:30:00Z' },
  { id: 'e10', userId: 'u1', title: 'Monthly rent', amount: 150000, categoryId: 'c3', date: '2026-09-01', paymentMethod: 'bank transfer', createdAt: '2026-09-01T07:00:00Z' },
  { id: 'e11', userId: 'u1', title: 'Groceries', amount: 32000, categoryId: 'c1', date: '2026-09-15', paymentMethod: 'card', createdAt: '2026-09-15T11:00:00Z' },
  { id: 'e12', userId: 'u2', title: 'Bus card refill', amount: 10000, categoryId: 'c2', date: '2026-10-05', paymentMethod: 'mobile money', createdAt: '2026-10-05T07:30:00Z' },
  { id: 'e13', userId: 'u2', title: 'Textbooks', amount: 18000, categoryId: 'c7', date: '2026-10-09', paymentMethod: 'cash', createdAt: '2026-10-09T10:00:00Z' },
]

// Sample monthly budgets.
export const mockBudgets: Budget[] = [
  { id: 'b1', userId: 'u1', month: '2026-10', amount: 300000 },
  { id: 'b2', userId: 'u1', month: '2026-09', amount: 250000 },
  { id: 'b3', userId: 'u2', month: '2026-10', amount: 80000 },
]
