import { useState, useEffect } from 'react'
import { auth, onAuthStateChanged, User } from './firebase'
import { api } from '../config'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        api.get('auth/me').catch(() => {})
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
