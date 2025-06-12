import { Navigate, Outlet } from "react-router-dom";

// import { LoadingSpinner } from "./LoadingSpinner"; TODO: Add later
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ redirectTo = "/" }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
};
