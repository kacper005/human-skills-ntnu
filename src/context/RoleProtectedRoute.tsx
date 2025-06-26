import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { Role } from "@enums/Role";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const RoleProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn || !user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
