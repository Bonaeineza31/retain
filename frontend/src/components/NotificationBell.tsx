import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { DATA_CHANGED } from '../services/api'
import { listNotifications, markAllRead } from '../services/notificationService'
import type { NotificationList } from '../types/notification'
import { formatTimeAgo } from '../utils/format'

// how often the bell asks the server for new notifications
const CHECK_EVERY_MS = 30000

// The bell in the top bar. The number on it is how many notifications are unread.
export default function NotificationBell() {
  const [data, setData] = useState<NotificationList>({ items: [], unreadCount: 0 })
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const { pathname } = useLocation()

  const load = useCallback(() => {
    // a failed check is not worth bothering the person, the next check tries again
    listNotifications()
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setInterval(load, CHECK_EVERY_MS)
    // also look right after the person saves or deletes something
    window.addEventListener(DATA_CHANGED, load)
    return () => {
      clearInterval(timer)
      window.removeEventListener(DATA_CHANGED, load)
    }
  }, [load])

  // look again each time the person goes to another page
  useEffect(() => {
    load()
  }, [load, pathname])

  function handleOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchor(event.currentTarget)
    load()
  }

  // closing the list counts as having read it
  function handleClose() {
    setAnchor(null)
    if (data.unreadCount > 0) {
      markAllRead().catch(() => {})
    }
  }

  return (
    <>
      <IconButton onClick={handleOpen} aria-label={`Notifications, ${data.unreadCount} unread`}>
        <Badge badgeContent={data.unreadCount} color="error" max={9}>
          <NotificationsOutlined />
        </Badge>
      </IconButton>

      <Popover
        open={anchor !== null}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 340, maxWidth: 'calc(100vw - 32px)' } } }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Notifications
        </Typography>
        <Divider />

        {data.items.length === 0 ? (
          <Typography sx={{ p: 2, color: 'text.secondary' }}>No notifications yet.</Typography>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {data.items.map((item, index) => (
              <Box key={item._id}>
                {index > 0 && <Divider />}
                <Box sx={{ px: 2, py: 1.5, bgcolor: item.read ? 'transparent' : 'primary.light' }}>
                  <Typography variant="body2" sx={{ fontWeight: item.read ? 400 : 600, overflowWrap: 'anywhere' }}>
                    {item.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatTimeAgo(item.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Popover>
    </>
  )
}
