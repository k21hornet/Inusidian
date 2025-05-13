import axios from 'axios'
import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/auth/me`, { withCredentials: true })
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

export const useUser = () => useContext(UserContext)
