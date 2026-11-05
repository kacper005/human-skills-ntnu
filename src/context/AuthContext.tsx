import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User, createUser, getUserMe } from "@api/userApi";
import { axiosInstance } from "@api/axiosInstance";
import { AuthProvider as AuthProviderType } from "@enums/AuthProvider";
import { Gender } from "@enums/Gender";
import { Role } from "@enums/Role";

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
  loginWithGoogle: (idToken: string) => Promise<void>;
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

  const authenticateWithGoogle = async (idToken: string) => {
    const response = await axiosInstance.post<string>("/authenticate", {
      idToken,
      authProvider: AuthProviderType.GOOGLE,
    });
    return response.data;
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      let token: string;
      try {
        token = await authenticateWithGoogle(idToken);
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 404) {
          throw error;
        }
        // First Google sign-in: create a student account from the ID token
        await createUser({
          authProvider: AuthProviderType.GOOGLE,
          idToken,
          role: Role.STUDENT,
          gender: Gender.UNIDENTIFIED,
        });
        token = await authenticateWithGoogle(idToken);
      }

      localStorage.setItem("authToken", token);
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      await fetchUser();
    } catch (error) {
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
