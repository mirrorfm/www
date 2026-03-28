import { useAuth } from '../lib/auth'
import { signOut } from '../lib/firebase'
import Button from '@mui/material/Button'

export default function AuthStatus() {
  const { user, loading } = useAuth()

  if (loading || !user) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          style={{ width: 28, height: 28, borderRadius: '50%' }}
        />
      )}
      <Button
        onClick={signOut}
        size="small"
        sx={{ color: '#999', textTransform: 'none', fontSize: 14, whiteSpace: 'nowrap' }}
      >
        Sign out
      </Button>
    </div>
  )
}
