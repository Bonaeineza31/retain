import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

// Temporary page. The real sign in form comes next.
export default function SignInPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  async function quickSignIn(email: string, password: string) {
    await signIn({ email, password })
    navigate('/dashboard')
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom>
          Retain
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in form coming soon. For now, use a test account.
        </Typography>
        <Stack spacing={1.5}>
          <Button variant="contained" onClick={() => quickSignIn('aline@retain.rw', 'password123')}>
            Sign in as Aline (user)
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => quickSignIn('admin@retain.rw', 'admin123')}>
            Sign in as admin
          </Button>
          <Button component={RouterLink} to="/signup">
            Create an account
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
