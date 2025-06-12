import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppHeader from "./components/organisms/AppHeader";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "./components/theme";
import Game from "./components/Game";
import Questionnaire from "./components/Questionnaire";
import IntFluidController from "./components/games/intFluid/IntFluidController";
import Home from "./components/pages/Home";
import { SignIn } from "./components/pages/SignIn";
import { SignUp } from "./components/pages/SignUp";
import { Admin } from "./components/pages/Admin";
import { UserProfile } from "./components/pages/UserProfile";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { AdminRoute } from "./context/AdminRoute";
import { NotFound } from "./components/pages/NotFound";
import { StudyPrograms } from "./components/pages/StudyPrograms";
import { Users } from "./components/pages/Users";

//  Function to dynamically switch between light and dark mode
const getTheme = (darkMode: boolean) =>
  createTheme({
    ...theme, // Spread the existing theme properties
    palette: {
      ...theme.palette,
      mode: darkMode ? "dark" : "light", // Dynamically switch mode
    },
  });

export const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false); //  Dark mode state

  //  Memoize the theme to prevent unnecessary re-renders
  const muiTheme = React.useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* MUI global styling reset */}
      <Router>
        <AppHeader
          setIsOpen={setIsOpen}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode} //  Pass dark mode toggle function to header
        />
        <SignIn isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/test" element={<Questionnaire />} />
            <Route path="/test2" element={<IntFluidController />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="not-found" element={<NotFound />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/user-profile" element={<UserProfile />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/study-programs" element={<StudyPrograms />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/tests" element={<Admin />} />
              <Route path="/admin/games" element={<Admin />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
};
