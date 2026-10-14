import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import AppBar from '@mui/material/AppBar'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { Link as RouterLink, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface NavItem {
  label: string
  to: string
  icon: ReactNode
}

export default function AppLayout() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // add new pages here and they show up in both menus
  const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlined /> },
    { label: 'Expenses', to: '/expenses', icon: <ReceiptLongOutlined /> },
  ]
  if (isAdmin) {
    navItems.push({ label: 'Admin', to: '/admin', icon: <AdminPanelSettingsOutlined /> })
  }

  async function handleSignOut() {
    await signOut()
    navigate('/signin')
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: { xs: 9, sm: 0 } }}>
      <AppBar
        position="sticky"
        color="inherit"
        sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Box
            component={RouterLink}
            to="/dashboard"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
          >
            <Box component="img" src="/logo.svg" alt="" sx={{ width: 32, height: 32 }} />
            <Typography variant="h6" sx={{ color: 'primary.dark' }}>
              Retain
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, ml: 2, flexGrow: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                color="inherit"
                sx={{
                  borderRadius: 0,
                  borderBottom: 2,
                  borderColor: 'transparent',
                  '&.active': { color: 'primary.main', borderColor: 'primary.main' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />
          <Typography sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary' }}>
            {user?.name}
          </Typography>
          <Button onClick={handleSignOut} color="inherit">
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>

      <Paper
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
        }}
      >
        <BottomNavigation showLabels value={location.pathname}>
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.to}
              component={RouterLink}
              to={item.to}
              value={item.to}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
