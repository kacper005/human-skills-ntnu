import React from "react";
import { jwtDecode } from "jwt-decode";
import { axiosInstance } from "@api/axiosInstance";
import { User, getUserMe } from "@api/userApi";
import { AuthProvider as AuthProviderType } from "@enums/AuthProvider";

export interface AuthContextProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (
    email: string,
    password: string,
    authProvider: AuthProviderType.LOCAL
  ) => Promise<void>;
  loginWithGoogle: (credentialId: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
  undefined
);

const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const logout = () => {
    localStorage.removeItem("authToken");
    delete axiosInstance.defaults.headers.Authorization;
    setUser(null);
    setIsLoggedIn(false);
  };

  const fetchUser = async () => {
    try {
      const response = await getUserMe();
      setUser(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token && isTokenValid(token)) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      fetchUser();
    } else {
      logout();
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/authenticate", {
        email,
        password,
        authProvider: "LOCAL",
      });

      const token = response.data;
      localStorage.setItem("authToken", token);
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      await fetchUser();
    } catch (error) {
      logout();
      throw error;
    }
  };

  const loginWithGoogle = async (credentialId: string) => {
    try {
      const response = await axiosInstance.post("/authenticate", {
        credentialId,
        authProvider: "GOOGLE",
      });

      const token = response.data;
      localStorage.setItem("authToken", token);
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      await fetchUser();
    } catch (error) {
      console.error("Google login failed", error);
      logout();
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoggedIn,
    loading,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
