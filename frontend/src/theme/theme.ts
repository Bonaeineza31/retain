import { createTheme } from '@mui/material/styles'

const ink = '#1F2A24'
const paper = '#F6F1E7'
const surface = '#FFFDF8'
const line = '#E2DACB'

// success / warning / error double as the budget states:
// within budget, approaching budget, over budget
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2F5D50', contrastText: surface },
    secondary: { main: '#C8643C', contrastText: surface },
    success: { main: '#3F7D58' },
    warning: { main: '#D99A2B' },
    error: { main: '#B3412E' },
    background: { default: paper, paper: surface },
    text: { primary: ink, secondary: '#5C675F' },
    divider: line,
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600 },
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
  },
})

export default theme
