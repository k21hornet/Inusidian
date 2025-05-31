import axios from 'axios'
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from '../types/User'

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchUser = async () => {
    try {
      const res = await axios.get<User>(`${import.meta.env.VITE_API}/auth/me`, { withCredentials: true })
      setUser(res.data)
    } catch {
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}


export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
