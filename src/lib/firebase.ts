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

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  if (credential?.accessToken) {
    sessionStorage.setItem(YT_TOKEN_KEY, credential.accessToken)
  }
  return result
}

export function getYouTubeAccessToken(): string | null {
  return sessionStorage.getItem(YT_TOKEN_KEY)
}

export async function refreshYouTubeAccessToken(): Promise<string | null> {
  const result = await signInWithPopup(auth, googleProvider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  if (credential?.accessToken) {
    sessionStorage.setItem(YT_TOKEN_KEY, credential.accessToken)
    return credential.accessToken
  }
  return null
}

export async function signOut() {
  return firebaseSignOut(auth)
}

export { onAuthStateChanged }
export type { User }
