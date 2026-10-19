import AddOutlined from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'

interface NavItem {
  label: string
  to: string
}

const mainItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Expenses', to: '/expenses' },
  { label: 'Budget', to: '/budget' },
]

const adminItems: NavItem[] = [
  { label: 'Insights', to: '/admin' },
  { label: 'Categories', to: '/admin/categories' },
]

interface Props {
  userName?: string
  isAdmin: boolean
  onAddExpense: () => void
  onSignOut: () => void
  // called after a link is pressed, and by the close button (phone drawer)
  onClose: () => void
}

// the small grey title above a group of links
function GroupTitle({ children }: { children: string }) {
  return (
    <Typography
      variant="caption"
      sx={{ px: 1.5, py: 0.5, display: 'block', color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
    >
      {children}
    </Typography>
  )
}

// The menu on the left: logo, add button, links and who is signed in.
export default function Sidebar({ userName, isAdmin, onAddExpense, onSignOut, onClose }: Props) {
  const { pathname } = useLocation()

  // the dashboard link must match exactly, the others also match their sub pages (/expenses/5)
  function isActive(item: NavItem, exact: boolean) {
    return exact ? pathname === item.to : pathname.startsWith(item.to)
  }

  function renderLinks(items: NavItem[], exact: boolean) {
    return items.map((item) => {
      const active = isActive(item, exact || item.to === '/dashboard')
      return (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          onClick={onClose}
          sx={{
            mb: 0.5,
            py: 1,
            px: 1.5,
            fontSize: '0.9rem',
            borderLeft: 3,
            borderColor: active ? 'secondary.main' : 'transparent',
            color: active ? 'primary.main' : 'text.primary',
            bgcolor: active ? 'primary.light' : 'transparent',
            fontWeight: active ? 600 : 500,
            '&:hover': { bgcolor: active ? 'primary.light' : 'action.hover' },
          }}
        >
          {item.label}
        </ListItemButton>
      )
    })
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: 1, borderColor: 'divider' }}>
        <Box
          component={RouterLink}
          to="/dashboard"
          onClick={onClose}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}
        >
          <Logo size={32} />
          <Typography variant="h6" sx={{ color: 'primary.dark' }}>
            Retain
          </Typography>
        </Box>

        <Button onClick={onClose} size="small" sx={{ display: { md: 'none' }, color: 'text.secondary', minWidth: 0 }}>
          Close
        </Button>
      </Box>

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => {
            onClose()
            onAddExpense()
          }}
        >
          Add expense
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, px: 1.5, py: 1.5, overflowY: 'auto' }}>
        <GroupTitle>Menu</GroupTitle>
        <List disablePadding sx={{ mb: 2 }}>
          {renderLinks(mainItems, false)}
        </List>

        {isAdmin && (
          <>
            <GroupTitle>Admin</GroupTitle>
            <List disablePadding>{renderLinks(adminItems, true)}</List>
          </>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {userName}
            </Typography>
            <Chip label={isAdmin ? 'Admin' : 'User'} size="small" sx={{ height: 18, fontSize: '0.65rem', mt: 0.25 }} />
          </Box>
          <Button
            size="small"
            color="inherit"
            onClick={onSignOut}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, minWidth: 0, px: 1, whiteSpace: 'nowrap' }}
          >
            Sign out
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
