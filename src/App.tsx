import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAuth } from "@hooks/useAuth";
import { ProtectedRoute } from "@context/ProtectedRoute";
import { AdminRoute } from "@context/AdminRoute";
import { Home } from "@pages/Home";
import { SignIn } from "@pages/SignIn";
import { SignUp } from "@pages/SignUp";
import { NotFound } from "@pages/NotFound";
import { Admin } from "@pages/Admin/Admin";
import { UserProfile } from "@pages/UserProfile";
import { AdminUsers } from "@pages/Admin/AdminUsers";
import { AdminTests } from "@pages/Admin/AdminTests";
import { AdminGames } from "@pages/Admin/AdminGames";
import { AdminStudyPrograms } from "@pages/Admin/AdminStudyPrograms";
import theme from "./components/theme";
import { Game } from "./components/Game";
import Questionnaire from "./components/Questionnaire";
import { IntFluidController } from "./components/games/intFluid/IntFluidController";
import { AppHeader } from "@organisms/AppHeader";
import "./App.css";

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
              <Route
                path="/admin/study-programs"
                element={<AdminStudyPrograms />}
              />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/tests" element={<AdminTests />} />
              <Route path="/admin/games" element={<AdminGames />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
};
