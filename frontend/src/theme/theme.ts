import { createTheme } from '@mui/material/styles'

export type ColorMode = 'light' | 'dark'

// blueberry. light mode is a cool "cloud" page with white cards and deep blue for everything you press.
// dark mode is a night blue page, with a soft blue for everything you press
const colors = {
  light: {
    ink: '#1A1F3D',
    inkSoft: '#545A7A',
    page: '#F4F5FB',
    surface: '#FFFFFF',
    line: '#DDE1F0',
    // success / warning / error double as the budget states:
    // within budget, approaching budget, over budget
    primary: { main: '#27368A', dark: '#1B2766', light: '#DDE1F3', contrastText: '#FFFFFF' },
    secondary: { main: '#5B6BC8', dark: '#4655B0', contrastText: '#FFFFFF' },
    success: { main: '#2E7D5B', contrastText: '#FFFFFF' },
    warning: { main: '#E0A100', contrastText: '#1A1F3D' },
    error: { main: '#A3152A', contrastText: '#FFFFFF' },
  },
  dark: {
    ink: '#E8EAF8',
    inkSoft: '#A6ACD0',
    page: '#0E1126',
    surface: '#171B38',
    line: '#2A3060',
    // buttons are a light blue with dark text, because white text would be too faint on it
    primary: { main: '#9AA7FF', dark: '#7C8CF2', light: '#262E66', contrastText: '#0E1126' },
    secondary: { main: '#7F8FE8', dark: '#6A7AD6', contrastText: '#0E1126' },
    success: { main: '#4FC38A', contrastText: '#0E1126' },
    warning: { main: '#F2B93B', contrastText: '#0E1126' },
    error: { main: '#FF7A8A', contrastText: '#0E1126' },
  },
}

// builds the theme of the app for light or dark mode
export function createAppTheme(mode: ColorMode) {
  const c = colors[mode]

  return createTheme({
    palette: {
      mode,
      primary: c.primary,
      secondary: c.secondary,
      success: c.success,
      warning: c.warning,
      error: c.error,
      background: { default: c.page, paper: c.surface },
      text: { primary: c.ink, secondary: c.inkSoft },
      divider: c.line,
    },
    shape: { borderRadius: 6 },
    typography: {
      fontFamily: '"DM Sans", system-ui, sans-serif',
      // the big headings shrink with the screen, but never below a readable size
      h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: 'clamp(2.25rem, 10vw, 3.75rem)' },
      h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: 'clamp(2rem, 8vw, 3rem)' },
      h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: 'clamp(1.75rem, 7vw, 2.5rem)' },
      h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: 'clamp(1.5rem, 6vw, 2rem)' },
      h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
      h6: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { border: `1px solid ${c.line}`, backgroundImage: 'none' },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      // slightly smaller text inside inputs on phones so dates and labels fit
      MuiInputBase: {
        styleOverrides: {
          root: ({ theme }) => ({
            [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            [theme.breakpoints.down('sm')]: { fontSize: '0.875rem' },
          }),
        },
      },
    },
  })
}
