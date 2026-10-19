import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { CategoryStat } from '../types/admin'

interface Props {
  title: string
  items: CategoryStat[]
}

// A numbered list of categories with how many expenses use each.
export default function RankedCategories({ title, items }: Props) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {items.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>No categories yet.</Typography>
      ) : (
        items.map((item, index) => (
          <Box key={item.categoryId}>
            {index > 0 && <Divider />}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, py: 1.25 }}>
              <Typography sx={{ color: 'text.secondary', width: 20 }}>{index + 1}</Typography>
              <Typography sx={{ flexGrow: 1, fontWeight: 600, minWidth: 0 }} noWrap>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {item.count} {item.count === 1 ? 'expense' : 'expenses'}
              </Typography>
            </Box>
          </Box>
        ))
      )}
    </Paper>
  )
}
