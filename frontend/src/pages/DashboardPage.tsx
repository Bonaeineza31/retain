import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useAuth from '../hooks/useAuth'

// Temporary content. The real dashboard comes later.
export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h3" gutterBottom>
        Hello, {user?.name}
      </Typography>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6">Monthly budget</Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
          226,000 RWF spent of 300,000 RWF
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label="Within" color="success" />
          <Chip label="Approaching" color="warning" />
          <Chip label="Over" color="error" />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button variant="contained">Add expense</Button>
          <Button variant="outlined" color="secondary">
            View all
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
