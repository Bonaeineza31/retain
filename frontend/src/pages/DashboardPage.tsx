import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// Temporary page to check the routes and the colors.
export default function DashboardPage() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/signin')
  }

  return (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <Typography variant="h3" gutterBottom>
        Hello, {user?.name}
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6">Monthly budget</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          226,000 RWF spent of 300,000 RWF
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label="Within" color="success" />
          <Chip label="Approaching" color="warning" />
          <Chip label="Over" color="error" />
        </Box>
        <Button variant="contained" sx={{ mr: 1 }}>
          Add expense
        </Button>
        <Button variant="outlined" color="secondary">
          View all
        </Button>
      </Paper>
      {isAdmin && (
        <Button component={RouterLink} to="/admin" color="secondary" sx={{ mr: 1 }}>
          Admin dashboard
        </Button>
      )}
      <Button onClick={handleSignOut}>Sign out</Button>
    </Box>
  )
}
