import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'

// Temporary page. The admin tools come later.
export default function AdminDashboardPage() {
  return (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <Typography variant="h3" gutterBottom>
        Admin
      </Typography>
      <Paper sx={{ p: 3, mb: 2, borderColor: 'secondary.main' }}>
        <Typography>Only admins can see this page.</Typography>
      </Paper>
      <Button component={RouterLink} to="/dashboard">
        Back to dashboard
      </Button>
    </Box>
  )
}
