import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import useColorMode from '../hooks/useColorMode'

// The button that switches between light and dark mode.
export default function ColorModeToggle() {
  const { mode, toggleMode } = useColorMode()
  const label = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'

  return (
    <Tooltip title={label}>
      <IconButton onClick={toggleMode} aria-label={label}>
        {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
      </IconButton>
    </Tooltip>
  )
}
