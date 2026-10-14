import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { BudgetSummary } from '../types/budget'
import { STATUS_COLOR, STATUS_LABEL } from '../utils/budget'
import { formatMonth, formatRWF } from '../utils/format'

interface Props {
  month: string
  summary: BudgetSummary
}

// Shows how much of the month's budget is used, with a bar and a status.
export default function BudgetSummaryCard({ month, summary }: Props) {
  const { budget, spent, remaining, status } = summary

  if (!budget) {
    return (
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6">{formatMonth(month)}</Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          No budget set for this month yet. You have spent {formatRWF(spent)} so far.
        </Typography>
      </Paper>
    )
  }

  const percent = Math.round((spent / budget.amount) * 100)
  const color = STATUS_COLOR[status]

  let message = `You have used ${percent}% of your budget.`
  if (status === 'over') {
    message = `You are over budget by ${formatRWF(spent - budget.amount)}.`
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="h6">{formatMonth(month)}</Typography>
        <Chip label={STATUS_LABEL[status]} color={color} />
      </Box>

      <LinearProgress
        variant="determinate"
        value={Math.min(100, percent)}
        color={color}
        sx={{ height: 10, borderRadius: 5, mb: 1 }}
        aria-label="Budget used"
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        {message}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        <Figure label="Budget" value={formatRWF(budget.amount)} />
        <Figure label="Spent" value={formatRWF(spent)} />
        <Figure
          label={remaining < 0 ? 'Over by' : 'Remaining'}
          value={formatRWF(Math.abs(remaining))}
          color={remaining < 0 ? 'error.main' : undefined}
        />
      </Box>
    </Paper>
  )
}

// One labelled number, like Spent or Remaining.
function Figure({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ color: color }}>
        {value}
      </Typography>
    </Box>
  )
}
