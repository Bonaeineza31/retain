import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Temporary content. The platform insights come next.
export default function AdminDashboardPage() {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 720 }}>
      <Typography variant="h6" gutterBottom>
        Platform insights
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>Coming soon.</Typography>
    </Paper>
  )
}
