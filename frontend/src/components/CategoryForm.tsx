import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useState, type FormEvent } from 'react'
import { createCategory, updateCategory } from '../services/categoryService'
import type { Category } from '../types/category'
import { validateCategoryName } from '../utils/validators'
import { getErrorMessage } from '../utils/errors'

interface Props {
  // when this is given the form renames it, otherwise it adds a new category
  category?: Category
  // names of the categories that already exist
  existingNames: string[]
  onClose: () => void
  onSaved: (message: string) => void
}

// The pop-up form for adding or renaming a category.
export default function CategoryForm({ category, existingNames, onClose, onSaved }: Props) {
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Checks the name, then saves the category.
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    // when renaming, the category's own name does not count as taken
    const others = category ? existingNames.filter((n) => n !== category.name) : existingNames
    const found = validateCategoryName(name, others)
    if (found) {
      setError(found)
      return
    }

    setSubmitting(true)
    try {
      if (category) {
        await updateCategory(category._id, { name })
        onSaved('Category renamed')
      } else {
        await createCategory({ name })
        onSaved('Category added')
      }
    } catch (err) {
      setServerError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onClose={submitting ? undefined : onClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{category ? 'Rename category' : 'Add category'}</DialogTitle>
        <DialogContent>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          <TextField
            label="Category name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
              setServerError('')
            }}
            error={Boolean(error)}
            helperText={error}
            autoFocus
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : category ? 'Save' : 'Add category'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
