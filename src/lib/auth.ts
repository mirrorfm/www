import { useState, useEffect, useRef } from 'react'
import { auth, onAuthStateChanged, User } from './firebase'
import { api } from '../config'

const REGISTERED_KEY = 'user_registered'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const prevUser = useRef<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const wasSignedOut = prevUser.current === null
      prevUser.current = user
      setUser(user)
      setLoading(false)

      // Only call /auth/me on fresh sign-in, not session restore
      if (user && (wasSignedOut && !loading || !sessionStorage.getItem(REGISTERED_KEY))) {
        api.get('auth/me').then(() => {
          sessionStorage.setItem(REGISTERED_KEY, '1')
        }).catch(() => {})
      }
      if (!user) {
        sessionStorage.removeItem(REGISTERED_KEY)
      }
    })
    return unsubscribe
  }, [])

  return { user, loading }
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}
