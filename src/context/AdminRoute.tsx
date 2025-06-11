import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = () => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || user?.role !== "ADMIN") {
    return <Navigate to="/not-found" />;
  }

  return <Outlet />;
};
