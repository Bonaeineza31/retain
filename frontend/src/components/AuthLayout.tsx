import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { keyframes } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import Logo from './Logo'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

// the logo starts small and a little turned, then settles into place
const pop = keyframes`
  from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
`

// the other parts fade in and rise a little
const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

// plays an animation once. people who asked their device for less motion see no animation
const play = (name: ReturnType<typeof keyframes>, delay: number) => ({
  animation: `${name} 600ms ease-out ${delay}ms backwards`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
})

// The logo, the name and a card, around the sign in and sign up forms.
export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    // the page starts near the top, so the card is not pushed down the screen
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', px: 2, pt: { xs: 3, sm: 6 }, pb: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Box
            sx={{
              width: { xs: 56, sm: 64 },
              mx: 'auto',
              ...play(pop, 0),
              // a small wiggle when the mouse is over it
              transition: 'transform 250ms ease',
              '&:hover': { transform: 'scale(1.08) rotate(-4deg)' },
            }}
          >
            <Logo size={{ xs: 56, sm: 64 }} />
          </Box>
          <Typography variant="h4" sx={{ color: 'primary.main', ...play(rise, 180) }}>
            Retain
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', ...play(rise, 300) }}>
            Keep more of what you earn.
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 3, sm: 4 }, ...play(rise, 420) }}>
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
