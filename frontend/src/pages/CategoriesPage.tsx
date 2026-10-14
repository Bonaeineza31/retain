import DeleteOutlined from '@mui/icons-material/DeleteOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import CategoryForm from '../components/CategoryForm'
import ConfirmDialog from '../components/ConfirmDialog'
import { deleteCategory, listCategories } from '../services/categoryService'
import type { Category } from '../types/category'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState('')
  // goes up by one after an add, rename or delete, to load the list again
  const [reloadCount, setReloadCount] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>(undefined)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let outdated = false

    listCategories()
      .then((list) => {
        if (!outdated) {
          setCategories(list)
          setError('')
        }
      })
      .catch((err) => {
        if (!outdated) setError(err.message)
      })

    return () => {
      outdated = true
    }
  }, [reloadCount])

  function openAdd() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openRename(category: Category) {
    setEditing(category)
    setFormOpen(true)
  }

  function handleSaved(text: string) {
    setFormOpen(false)
    setMessage(text)
    setReloadCount(reloadCount + 1)
  }

  async function handleConfirmDelete() {
    if (!deleting) return
    setDeleteBusy(true)
    try {
      await deleteCategory(deleting.id)
      setMessage('Category deleted')
      setReloadCount(reloadCount + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setDeleteBusy(false)
    setDeleting(null)
  }

  const defaultName = categories?.find((c) => c.isDefault)?.name ?? 'the default category'

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5">Expense categories</Typography>
        <Button variant="contained" onClick={openAdd} sx={{ whiteSpace: 'nowrap' }}>
          Add category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!categories ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper>
          {categories.map((category, index) => (
            <Box key={category.id}>
              {index > 0 && <Divider />}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 600, minWidth: 0 }} noWrap>
                  {category.name}
                </Typography>

                {category.isDefault ? (
                  <Chip label="Default" size="small" />
                ) : (
                  <Box sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton
                      size="small"
                      aria-label={`Rename ${category.name}`}
                      onClick={() => openRename(category)}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => setDeleting(category)}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      {formOpen && categories && (
        <CategoryForm
          category={editing}
          existingNames={categories.map((c) => c.name)}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this category?"
        message={
          deleting
            ? `"${deleting.name}" will be removed. Expenses in it will be moved to ${defaultName}.`
            : ''
        }
        confirmLabel="Delete"
        busy={deleteBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleting(null)}
      />

      <Snackbar
        open={message !== ''}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Box>
  )
}
