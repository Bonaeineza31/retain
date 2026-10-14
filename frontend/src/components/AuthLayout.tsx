import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

// The card with the logo around the sign in and sign up forms.
export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box component="img" src="/logo.svg" alt="" sx={{ width: 32, height: 32 }} />
          <Typography variant="h5" sx={{ color: 'primary.dark' }}>
            Retain
          </Typography>
        </Box>
        <Paper sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography sx={{ mb: 3, color: 'text.secondary' }}>
            {subtitle}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Box>
  )
}
