import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface Props {
  title: string
  // the lines under the title
  details: ReactNode
  caption?: string
  amount: string
  // a small line under the amount
  amountNote?: string
  // shows the amount in the main colour
  highlight?: boolean
}

// One line of an admin list: a title with details on the left, an amount on the right.
export default function AdminListRow({ title, details, caption, amount, amountNote, highlight }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600 }} noWrap>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', overflowWrap: 'anywhere' }} component="div">
          {details}
        </Typography>
        {caption && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {caption}
          </Typography>
        )}
      </Box>
      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap', color: highlight ? 'primary.main' : undefined }}>
          {amount}
        </Typography>
        {amountNote && (
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            {amountNote}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
