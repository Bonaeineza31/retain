import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface Props {
  label: string
  value: string
}

export default function StatTile({ label, value }: Props) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderLeft: 4, borderLeftColor: 'primary.main' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Paper>
  )
}
