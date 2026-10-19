import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/material/styles'
import type { ReactNode } from 'react'
import Logo from './Logo'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
}

const pop = keyframes`
  from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
`

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`

const play = (name: ReturnType<typeof keyframes>, delay: number) => ({
  animation: `${name} 600ms ease-out ${delay}ms backwards`,
  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
})

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        px: 2,
        py: { xs: 4, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: 440, md: 840 },
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: { xs: 3, md: 5 },
          alignItems: 'center',
        }}
      >
        {/* Left Side: Brand Narrative */}
        <Box sx={{ ...play(rise, 100), textAlign: { xs: 'center', md: 'left' } }}>
          <Box
            sx={{
              width: { xs: 52, sm: 60 },
              mx: { xs: 'auto', md: 0 },
              mb: 1.5,
              ...play(pop, 0),
              transition: 'transform 250ms ease',
              '&:hover': { transform: 'scale(1.08) rotate(-4deg)' },
            }}
          >
            <Logo size={{ xs: 52, sm: 60 }} />
          </Box>

          <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>
            Retain
          </Typography>

          <Typography variant="h5" sx={{ color: 'text.primary', mb: 1.5 }}>
            Keep more of what you earn.
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 360, mx: { xs: 'auto', md: 0 } }}>
            A personal expense and budget manager tailored for Rwandan Francs (RWF). Record expenditures, set spending limits, and track where your money goes.
          </Typography>
        </Box>

        {/* Right Side: Form Paper */}
        <Paper sx={{ p: { xs: 3, sm: 4 }, ...play(rise, 300) }}>
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
