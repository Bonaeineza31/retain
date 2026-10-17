import { createTheme } from '@mui/material/styles'

// blueberry and cream soda: a cream page, lighter cream cards, and deep blue for everything you press
const ink = '#1A1F3D'
const page = '#FCF0C9'
const surface = '#FFFAEB'
const line = '#E3D29B'

// success / warning / error double as the budget states:
// within budget, approaching budget, over budget
const theme = createTheme({
  palette: {
    mode: 'light',
    // blueberry: for buttons, links and the active tab ("light" is the pale track behind chart bars)
    primary: { main: '#27368A', dark: '#1B2766', light: '#DDE1F3', contrastText: '#FFFFFF' },
    // a lighter blue, for thin accents like the active tab line and the edge of the stat tiles
    secondary: { main: '#5B6BC8', dark: '#4655B0', contrastText: '#FFFFFF' },
    success: { main: '#2E7D5B', contrastText: '#FFFFFF' },
    warning: { main: '#E0A100', contrastText: '#1A1F3D' },
    error: { main: '#A3152A', contrastText: '#FFFFFF' },
    background: { default: page, paper: surface },
    text: { primary: ink, secondary: '#545A7A' },
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
