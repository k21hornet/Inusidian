import { Navigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

function PrivateRoute({ children }) {
  const { user, loading } = useUser()
  if (loading) return <div>読み込み中...</div>
  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
