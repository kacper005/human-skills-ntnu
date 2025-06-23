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
import { ScrollToTop } from "@hooks/ScrollToTop";
import { Home } from "@pages/Home";
import { SignIn } from "@pages/SignIn";
import { SignUp } from "@pages/SignUp";
import { NotFound } from "@pages/NotFound";
import { Admin } from "@pages/Admin/Admin";
import { UserProfile } from "@pages/UserProfile";
import { AdminUsers } from "@pages/Admin/AdminUsers";
import { MyTestSessions } from "@pages/MyTestSessions";
import { AdminTestTemplates } from "@pages/Admin/AdminTestTemplates";
import { AdminGameTemplates } from "@pages/Admin/AdminGameTemplates";
import { AdminStudyPrograms } from "@pages/Admin/AdminStudyPrograms";
import theme from "./components/theme";
import { Game } from "./components/Game";
import { Questionnaire } from "./components/Questionnaire";
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
        <ScrollToTop />
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
            <Route path="/test/big5" element={<Questionnaire />} />
            <Route path="/test/int-fluid" element={<IntFluidController />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="not-found" element={<NotFound />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/my-test-sessions" element={<MyTestSessions />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/admin/study-programs"
                element={<AdminStudyPrograms />}
              />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route
                path="/admin/test-templates"
                element={<AdminTestTemplates />}
              />
              <Route
                path="/admin/game-templates"
                element={<AdminGameTemplates />}
              />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
};
