import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface Props {
  label: string
  value: string
  subtitle?: string
}

// A small box with one label, one big number, and an optional subtitle.
export default function StatTile({ label, value, subtitle }: Props) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderLeft: 4, borderLeftColor: 'secondary.main' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ wordBreak: 'break-word', my: 0.5 }}>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {subtitle}
        </Typography>
      )}
    </Paper>
  )
}
