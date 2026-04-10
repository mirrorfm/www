import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { signInWithGoogle } from '../lib/firebase'
import Header from '../components/Header'
import Button from '@mui/material/Button'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (user) navigate(redirect)
  }, [user, navigate, redirect])

  if (loading) return null

  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        paddingTop: 80,
        gap: 24,
      }}>
        <h2 style={{ color: '#d4d4d4', fontWeight: 400 }}>Sign in to Mirror.FM</h2>
        <Button
          onClick={signInWithGoogle}
          variant="outlined"
          startIcon={<FcGoogle />}
          sx={{
            color: '#d4d4d4',
            borderColor: '#555',
            textTransform: 'none',
            fontSize: 16,
            padding: '10px 24px',
            '&:hover': { borderColor: '#888' },
          }}
        >
          Continue with Google
        </Button>
      </div>
    </>
  )
}
