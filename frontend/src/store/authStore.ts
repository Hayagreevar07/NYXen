import { create } from 'zustand'
import { initializeApp } from 'firebase/app'
import { getAuth, signOut, User } from 'firebase/auth'

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

let auth = null
if (firebaseConfig.apiKey) {
  initializeApp(firebaseConfig)
  auth = getAuth()
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initializeAuth: () => void
  logout: () => Promise<void>
}

/**
 * Auth Store
 * Global authentication state management
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  initializeAuth: () => {
    if (!auth) {
      set({ loading: false })
      return
    }

    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        set({ user, loading: false })
      },
      (error) => {
        set({ error: error.message, loading: false })
      }
    )

    // Cleanup on unmount
    return () => unsubscribe()
  },

  logout: async () => {
    if (!auth) return
    try {
      await signOut(auth)
      set({ user: null })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },
}))
