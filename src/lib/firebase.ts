import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('https://www.googleapis.com/auth/youtube.readonly')

const YT_TOKEN_KEY = 'yt_access_token'
const YT_TOKEN_TIME_KEY = 'yt_access_token_time'

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  if (credential?.accessToken) {
    localStorage.setItem(YT_TOKEN_KEY, credential.accessToken)
    localStorage.setItem(YT_TOKEN_TIME_KEY, Date.now().toString())
  }
  return result
}

export function getYouTubeAccessToken(): string | null {
  const token = localStorage.getItem(YT_TOKEN_KEY)
  const time = localStorage.getItem(YT_TOKEN_TIME_KEY)
  if (!token || !time) return null
  // Google access tokens expire after ~1 hour, discard after 50 min to be safe
  if (Date.now() - parseInt(time) > 50 * 60 * 1000) return null
  return token
}

export async function refreshYouTubeAccessToken(): Promise<string | null> {
  // Skip "Choose an account" screen if already signed in
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/youtube.readonly')
  if (auth.currentUser?.email) {
    provider.setCustomParameters({ login_hint: auth.currentUser.email })
  }
  const result = await signInWithPopup(auth, provider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  if (credential?.accessToken) {
    localStorage.setItem(YT_TOKEN_KEY, credential.accessToken)
    localStorage.setItem(YT_TOKEN_TIME_KEY, Date.now().toString())
    return credential.accessToken
  }
  return null
}

export async function signOut() {
  localStorage.removeItem(YT_TOKEN_KEY)
  localStorage.removeItem(YT_TOKEN_TIME_KEY)
  return firebaseSignOut(auth)
}

export { onAuthStateChanged }
export type { User }
