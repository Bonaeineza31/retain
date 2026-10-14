// A group for expenses, like Food or Transport.
export interface Category {
  id: string
  name: string
  // the fallback category (Uncategorized): it cannot be renamed or deleted
  isDefault: boolean
  createdAt: string
}

// What the category form sends.
export interface CategoryInput {
  name: string
}
