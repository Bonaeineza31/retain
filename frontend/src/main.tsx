import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import CssBaseline from '@mui/material/CssBaseline'
import AuthProvider from './context/AuthProvider'
import { store } from './store'
import theme from './theme/theme'
import App from './App.tsx'

// Starts the app. The providers give every page the store, the theme and the sign in state.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
