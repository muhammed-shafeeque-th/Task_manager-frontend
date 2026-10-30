import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";

/** Gate for authenticated pages; remembers where the user was heading. */
export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  if (!token)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

/** Keeps signed-in users away from the login/register screens. */
export function PublicOnlyRoute() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/" replace />;
  
  return <Outlet />;
}
