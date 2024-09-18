import { getAnalytics, setUserId } from 'firebase/analytics'
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth'
import { useEffect, useState, createContext, useContext } from 'react'
import { firebaseAuth } from '~/services/firebase'
import * as ga from '../ga'

interface IUserContext {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  logout: () => void
}

export const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const logout = async () => {
    await firebaseAuth.signOut()
    setCurrentUser(null)
    await signInAnonymously(firebaseAuth)
  }
  const value = { currentUser, setCurrentUser, logout }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setCurrentUser(user)
        const analytics = getAnalytics()
        setUserId(analytics, user.uid)
        ga.setUserId(user.uid)
      } else if (!currentUser) {
        setTimeout(async () => {
          await signInAnonymously(firebaseAuth)
        }, 200)
      }
    })

    return () => unsubscribe()
  }, [currentUser])

  return <UserContext.Provider value={value as any}>{children}</UserContext.Provider>
}

export const useAuth = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  return context
}
