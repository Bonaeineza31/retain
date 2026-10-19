import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'

const links = [
  { label: 'Insights', to: '/admin' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Users', to: '/admin/users' },
  { label: 'All expenses', to: '/admin/expenses' },
]

export default function AdminLayout() {
  const location = useLocation()

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
            Platform numbers, categories, users and expenses
          </Typography>
        </Box>

        {/* Segmented Navigation Buttons */}
        <Box
          sx={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            p: 0.5,
            borderRadius: 1,
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
          }}
        >
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Button
                key={link.to}
                component={RouterLink}
                to={link.to}
                size="small"
                sx={{
                  borderRadius: 0.5,
                  px: 2,
                  bgcolor: active ? 'primary.main' : 'transparent',
                  color: active ? '#FFFFFF' : 'text.primary',
                  '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' },
                }}
              >
                {link.label}
              </Button>
            )
          })}
        </Box>
      </Paper>

      <Outlet />
    </Box>
  )
}
