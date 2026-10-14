import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Temporary content. The admin tools come later.
export default function AdminDashboardPage() {
  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography variant="h3" gutterBottom>
        Admin
      </Typography>
      <Paper sx={{ p: 3, borderColor: 'secondary.main' }}>
        <Typography>Only admins can see this page.</Typography>
      </Paper>
    </Box>
  )
}
