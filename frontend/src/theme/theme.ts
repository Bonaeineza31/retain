import { createTheme } from '@mui/material/styles'

// deep midnight and warm coral on a cool off-white
const ink = '#14161F'
const page = '#F4F5F7'
const surface = '#FFFFFF'
const line = '#E2E4EA'

// success / warning / error double as the budget states:
// within budget, approaching budget, over budget
const theme = createTheme({
  palette: {
    mode: 'light',
    // midnight: for buttons, links and the active tab (white text on it is readable)
    primary: { main: '#14161F', dark: '#000000', light: '#ECEDF2', contrastText: '#FFFFFF' },
    // coral: the accent. white text on it is too faint, so it uses midnight text,
    // and it is never used as text on a light background
    secondary: { main: '#FF6B4A', dark: '#E5502F', contrastText: '#14161F' },
    success: { main: '#2E7D5B', contrastText: '#FFFFFF' },
    // amber, because orange would look too much like the coral of the brand
    warning: { main: '#E0A100', contrastText: '#14161F' },
    // deep crimson, so "over budget" is not confused with the bright coral
    error: { main: '#A3152A', contrastText: '#FFFFFF' },
    background: { default: page, paper: surface },
    text: { primary: ink, secondary: '#5B6070' },
    divider: line,
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
        root: { border: `1px solid ${line}`, backgroundImage: 'none' },
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

export default theme
