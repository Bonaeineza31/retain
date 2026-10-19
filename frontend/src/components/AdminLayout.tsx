import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'

export default function AdminLayout() {
  const location = useLocation()
  const isCategories = location.pathname === '/admin/categories'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h3">
            Admin
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Platform metrics and category management
          </Typography>
        </Box>

        {/* Segmented Navigation Buttons */}
        <Box
          sx={{
            display: 'inline-flex',
            p: 0.5,
            borderRadius: 1,
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Button
            component={RouterLink}
            to="/admin"
            size="small"
            sx={{
              borderRadius: 0.5,
              px: 2,
              bgcolor: !isCategories ? 'primary.main' : 'transparent',
              color: !isCategories ? '#FFFFFF' : 'text.primary',
              '&:hover': {
                bgcolor: !isCategories ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            Insights
          </Button>
          <Button
            component={RouterLink}
            to="/admin/categories"
            size="small"
            sx={{
              borderRadius: 0.5,
              px: 2,
              bgcolor: isCategories ? 'primary.main' : 'transparent',
              color: isCategories ? '#FFFFFF' : 'text.primary',
              '&:hover': {
                bgcolor: isCategories ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            Categories
          </Button>
        </Box>
      </Paper>

      <Outlet />
    </Box>
  )
}
