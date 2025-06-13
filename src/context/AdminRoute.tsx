import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { Role } from "@enums/Role";

export const AdminRoute = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn || user?.role !== Role.ADMIN) {
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};
