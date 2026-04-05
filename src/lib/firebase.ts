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

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export async function signInWithYouTubeScope(): Promise<string | null> {
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/youtube.readonly')
  const result = await signInWithPopup(auth, provider)
  const credential = GoogleAuthProvider.credentialFromResult(result)
  return credential?.accessToken ?? null
}

export async function signOut() {
  return firebaseSignOut(auth)
}

export { onAuthStateChanged }
export type { User }
