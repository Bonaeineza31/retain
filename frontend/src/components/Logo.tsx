import Box from '@mui/material/Box'
import useColorMode from '../hooks/useColorMode'

interface Props {
  // the width and height in pixels. it can change with the screen size, like { xs: 56, sm: 64 }
  size: number | { xs: number; sm: number }
}

// The Retain logo. In dark mode it is the light blue one, so it shows on the dark page.
export default function Logo({ size }: Props) {
  const { mode } = useColorMode()

  return (
    <Box
      component="img"
      src={mode === 'dark' ? '/logo-dark.png' : '/logo.png'}
      alt=""
      sx={{ display: 'block', width: size, height: size, flexShrink: 0 }}
    />
  )
}
