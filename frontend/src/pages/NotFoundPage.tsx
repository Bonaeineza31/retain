import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box>
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          This page does not exist.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">
          Go to dashboard
        </Button>
      </Box>
    </Box>
  )
}
