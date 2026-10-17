import Box from '@mui/material/Box'

interface Props {
  // the width and height in pixels. it can change with the screen size, like { xs: 56, sm: 64 }
  size: number | { xs: number; sm: number }
}

// The Retain logo.
export default function Logo({ size }: Props) {
  return (
    <Box
      component="img"
      src="/logo.png"
      alt=""
      sx={{ display: 'block', width: size, height: size, flexShrink: 0 }}
    />
  )
}
