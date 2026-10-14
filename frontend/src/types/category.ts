export interface Category {
  id: string
  name: string
  // the fallback category (Uncategorized): it cannot be renamed or deleted
  isDefault: boolean
  createdAt: string
}

export interface CategoryInput {
  name: string
}
