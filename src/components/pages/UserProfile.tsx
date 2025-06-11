import React, { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">User Profile</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md w-full max-w-md">
        <p className="text-lg mb-2">
          <span className="font-semibold">Name:</span> {user.firstName}{" "}
          {user.lastName}
        </p>
        <p className="text-lg mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-lg mb-2">
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
};
