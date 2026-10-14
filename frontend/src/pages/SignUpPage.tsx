import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

// Temporary page. The real sign up form comes next.
export default function SignUpPage() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom>
          Create an account
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign up form coming soon.
        </Typography>
        <Button component={RouterLink} to="/signin">
          Back to sign in
        </Button>
      </Paper>
    </Box>
  )
}
