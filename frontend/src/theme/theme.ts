import { createTheme } from '@mui/material/styles'

// teal and orange are taken from the eNoti app
const ink = '#3C3C3C'
const page = '#F2F3F5'
const surface = '#FFFFFF'
const line = '#E1E4E6'

// success / warning / error double as the budget states:
// within budget, approaching budget, over budget
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0D767A', dark: '#0C5858', light: '#EAF4F3', contrastText: '#FFFFFF' },
    // white text on this orange is too faint, so buttons use dark text
    secondary: { main: '#E87C34', contrastText: '#2B2B2B' },
    success: { main: '#2E7D5B', contrastText: '#FFFFFF' },
    warning: { main: '#E3A21A', contrastText: '#2B2B2B' },
    error: { main: '#C0392B', contrastText: '#FFFFFF' },
    background: { default: page, paper: surface },
    text: { primary: ink, secondary: '#666666' },
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
