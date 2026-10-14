import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Temporary page to check the theme. Replaced when routing is added.
function App() {
  return (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <Typography variant="h3" gutterBottom>
        Retain
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Monthly budget</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          120,000 RWF spent of 200,000 RWF
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
    </Box>
  )
}

export default App
