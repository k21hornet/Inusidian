import { Navigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"
import type { ReactNode } from "react"

type PrivateRouteProps = {
  children: ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading } = useUser()
  if (loading) return <div>読み込み中...</div>
  return user ? children : <Navigate to="/signin" />
}

export default PrivateRoute
