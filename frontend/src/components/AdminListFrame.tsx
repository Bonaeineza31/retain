import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Children, type ReactNode } from 'react'

interface Props {
  title: string
  summary: string
  // the search box and filters
  searchBar: ReactNode
  error: string
  loading: boolean
  emptyText: string
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  // the rows of the list
  children: ReactNode
}

// The same frame for every admin list: a heading with the search, the rows, and the page buttons.
export default function AdminListFrame({
  title,
  summary,
  searchBar,
  error,
  loading,
  emptyText,
  page,
  pageCount,
  onPageChange,
  children,
}: Props) {
  const rows = Children.toArray(children)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Paper sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {summary}
        </Typography>
        {searchBar}
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : rows.length === 0 ? (
          <Typography sx={{ color: 'text.secondary' }}>{emptyText}</Typography>
        ) : (
          rows.map((row, index) => (
            <Box key={index}>
              {index > 0 && <Divider />}
              {row}
            </Box>
          ))
        )}
      </Paper>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination count={pageCount} page={page} onChange={(_, value) => onPageChange(value)} color="primary" />
        </Box>
      )}
    </Box>
  )
}
