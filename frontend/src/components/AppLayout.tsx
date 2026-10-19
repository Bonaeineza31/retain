import AddOutlined from '@mui/icons-material/AddOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link as RouterLink, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ExpenseForm from './ExpenseForm'
import Logo from './Logo'
import useAuth from '../hooks/useAuth'
import { listCategories } from '../services/categoryService'
import { resetFilters } from '../store/expenseFiltersSlice'
import { useAppDispatch } from '../store/hooks'
import type { Category } from '../types/category'
import { formatDate, todayAsText } from '../utils/format'

const SIDEBAR_WIDTH = 250

interface NavItem {
  label: string
  to: string
}

export default function AppLayout() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Expenses', to: '/expenses' },
    { label: 'Budget', to: '/budget' },
  ]

  const adminNavItems: NavItem[] = [
    { label: 'Insights', to: '/admin' },
    { label: 'Categories', to: '/admin/categories' },
  ]

  async function handleSignOut() {
    dispatch(resetFilters())
    await signOut()
    navigate('/signin')
  }

  function handleOpenQuickAdd() {
    listCategories().then(setCategories).catch(() => {})
    setQuickAddOpen(true)
  }

  const getPageTitle = () => {
    if (location.pathname.startsWith('/expenses/')) return 'Expense details'
    if (location.pathname === '/expenses') return 'Expenses'
    if (location.pathname === '/budget') return 'Budget'
    if (location.pathname === '/admin/categories') return 'Categories'
    if (location.pathname.startsWith('/admin')) return 'Admin'
    return 'Dashboard'
  }

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          component={RouterLink}
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Logo size={32} />
          <Typography variant="h6" sx={{ color: 'primary.dark' }}>
            Retain
          </Typography>
        </Box>

        <Button
          onClick={() => setMobileOpen(false)}
          size="small"
          sx={{ display: { md: 'none' }, color: 'text.secondary', minWidth: 0 }}
        >
          Close
        </Button>
      </Box>

      {/* Quick Add Button */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => {
            setMobileOpen(false)
            handleOpenQuickAdd()
          }}
        >
          Add expense
        </Button>
      </Box>

      {/* Navigation Links (Text only, no icons) */}
      <Box sx={{ flexGrow: 1, px: 1.5, py: 1.5, overflowY: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            py: 0.5,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Menu
        </Typography>

        <List disablePadding sx={{ mb: 2 }}>
          {mainNavItems.map((item) => {
            const isActive =
              item.to === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.to)

            return (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 0,
                  mb: 0.5,
                  py: 1,
                  px: 1.5,
                  borderLeft: 3,
                  borderColor: isActive ? 'secondary.main' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  bgcolor: isActive ? 'primary.light' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  '&:hover': {
                    bgcolor: isActive ? 'primary.light' : 'rgba(39, 54, 138, 0.04)',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' }}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            )
          })}
        </List>

        {isAdmin && (
          <>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                py: 0.5,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Admin
            </Typography>

            <List disablePadding>
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.to

                return (
                  <ListItemButton
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: 0,
                      mb: 0.5,
                      py: 1,
                      px: 1.5,
                      borderLeft: 3,
                      borderColor: isActive ? 'secondary.main' : 'transparent',
                      color: isActive ? 'primary.main' : 'text.primary',
                      bgcolor: isActive ? 'primary.light' : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      '&:hover': {
                        bgcolor: isActive ? 'primary.light' : 'rgba(39, 54, 138, 0.04)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                )
              })}
            </List>
          </>
        )}
      </Box>

      {/* User Session Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }} noWrap>
              {user?.name}
            </Typography>
            <Chip
              label={isAdmin ? 'Admin' : 'User'}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', mt: 0.25 }}
            />
          </Box>
          <Button
            size="small"
            color="inherit"
            onClick={handleSignOut}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, minWidth: 0, px: 1 }}
          >
            Sign out
          </Button>
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Left Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: SIDEBAR_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: SIDEBAR_WIDTH,
            borderRight: 1,
            borderColor: 'divider',
            zIndex: 1100,
          }}
        >
          {sidebarContent}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: SIDEBAR_WIDTH,
            borderRight: 1,
            borderColor: 'divider',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Canvas Layout */}
      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Header Bar */}
        <AppBar
          position="sticky"
          color="inherit"
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar
            sx={{
              gap: 2,
              px: { xs: 2, sm: 3 },
              minHeight: { xs: 56, sm: 60 },
            }}
          >
            <Button
              variant="outlined"
              size="small"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              Menu
            </Button>

            {/* Mobile Logo Brand */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
              }}
              component={RouterLink}
              to="/dashboard"
            >
              <Logo size={28} />
              <Typography variant="h6" sx={{ color: 'primary.dark' }}>
                Retain
              </Typography>
            </Box>

            {/* Desktop Section Breadcrumb */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h6" sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                {getPageTitle()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Today: {formatDate(todayAsText())}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              size="small"
              startIcon={<AddOutlined />}
              onClick={handleOpenQuickAdd}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Add expense
            </Button>

            <Typography variant="body2" sx={{ display: { xs: 'none', lg: 'block' }, color: 'text.secondary' }}>
              {user?.name}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content Body */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Container maxWidth="lg" disableGutters>
            <Outlet />
          </Container>
        </Box>
      </Box>

      {/* Global Quick Add Expense Form */}
      {quickAddOpen && (
        <ExpenseForm
          categories={categories}
          onClose={() => setQuickAddOpen(false)}
          onSaved={() => {
            setQuickAddOpen(false)
            navigate(0)
          }}
        />
      )}
    </Box>
  )
}
