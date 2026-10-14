import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined'
import AdminPanelSettingsOutlined from '@mui/icons-material/AdminPanelSettingsOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import AppBar from '@mui/material/AppBar'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { Link as RouterLink, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { resetFilters } from '../store/expenseFiltersSlice'
import { useAppDispatch } from '../store/hooks'

interface NavItem {
  label: string
  to: string
  icon: ReactNode
}

// The frame around every signed in page: a top bar on big screens, a tab bar on phones.
export default function AppLayout() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  // add new pages here and they show up in both menus
  const navItems: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlined /> },
    { label: 'Expenses', to: '/expenses', icon: <ReceiptLongOutlined /> },
    { label: 'Budget', to: '/budget', icon: <AccountBalanceWalletOutlined /> },
  ]
  if (isAdmin) {
    navItems.push({ label: 'Admin', to: '/admin', icon: <AdminPanelSettingsOutlined /> })
  }

  // sub pages like /admin/categories still highlight their main tab
  const activeTo = navItems.find((item) => location.pathname.startsWith(item.to))?.to ?? false

  // Signs out and goes back to the sign in page.
  // The filters are cleared too, so the next person does not see them.
  async function handleSignOut() {
    dispatch(resetFilters())
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
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 3 } }}>
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
          {/* phones get an icon, there is no room for the word */}
          <IconButton
            onClick={handleSignOut}
            aria-label="Sign out"
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          >
            <LogoutOutlined />
          </IconButton>
          <Button
            onClick={handleSignOut}
            color="inherit"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, whiteSpace: 'nowrap' }}
          >
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 3 } }}>
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
        <BottomNavigation showLabels value={activeTo}>
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.to}
              component={RouterLink}
              to={item.to}
              value={item.to}
              label={item.label}
              icon={item.icon}
              sx={{ minWidth: 0, px: 0.5 }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
