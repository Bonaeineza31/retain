import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { CategorySpending } from '../types/dashboard'
import { formatRWF } from '../utils/format'

interface Props {
  items: CategorySpending[]
  // category id -> category name
  categoryNames: Record<string, string>
}

export default function CategoryBreakdown({ items, categoryNames }: Props) {
  const total = items.reduce((sum, item) => sum + item.total, 0)

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Spending by category
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No expenses this month.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 2 }}>
          {items.map((item) => {
            const percent = Math.round((item.total / total) * 100)
            return (
              <Box key={item.categoryId}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 2, mb: 0.5 }}>
                  <Typography>{categoryNames[item.categoryId] || 'Unknown'}</Typography>
                  <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {formatRWF(item.total)}
                    <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                      {percent}%
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'primary.light' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${percent}%`,
                      borderRadius: 4,
                      bgcolor: 'primary.main',
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      )}
    </Paper>
  )
}
