import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import AuthProvider from './context/AuthProvider'
import ColorModeProvider from './context/ColorModeProvider'
import { store } from './store'
import App from './App.tsx'

// Starts the app. The providers give every page the store, the theme (light or dark) and the sign in state.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ColorModeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ColorModeProvider>
    </Provider>
  </StrictMode>,
)
