import { Navigate, Outlet } from "react-router-dom";

// import { LoadingSpinner } from "./LoadingSpinner"; TODO: Add later
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ redirectTo = "/sign-in" }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );

  return isLoggedIn ? <Outlet /> : <Navigate to={redirectTo} />;
};
