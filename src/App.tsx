import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@hooks/useAuth";
import { ScrollToTop } from "@hooks/ScrollToTop";
import { ProtectedRoute } from "@context/ProtectedRoute";
import { RoleProtectedRoute } from "@context/RoleProtectedRoute";
import { Home } from "@pages/Home";
import { SignIn } from "@pages/SignIn";
import { SignUp } from "@pages/SignUp";
import { Support } from "@pages/Support";
import { NotFound } from "@pages/NotFound";
import { Admin } from "@pages/Admin/Admin";
import { UserProfile } from "@pages/UserProfile";
import { AdminUsers } from "@pages/Admin/AdminUsers";
import { MyTestSessions } from "@pages/MyTestSessions";
import { SharedSessions } from "@pages/SharedSessions";
import { AdminTestTemplates } from "@pages/Admin/AdminTestTemplates";
import { AdminGameTemplates } from "@pages/Admin/AdminGameTemplates";
import { AdminStudyPrograms } from "@pages/Admin/AdminStudyPrograms";
import theme from "./components/theme";
import { Game } from "./components/Game";
import { AttentionGame2 } from "./components/games/attention/AttentionGame2";
import { Questionnaire } from "./components/Questionnaire";
import { IntFluidController } from "./components/games/intFluid/IntFluidController";
import { AppHeader } from "@organisms/AppHeader";
import { Role } from "@enums/Role";
import "./App.css";

const getTheme = (darkMode: boolean) =>
  createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? "dark" : "light",
    },
  });

export const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

  const muiTheme = React.useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <AppHeader
          setIsOpen={setIsOpen}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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
            <Route path="/support" element={<Support />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/attention-game" element={<AttentionGame2 />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/my-test-sessions" element={<MyTestSessions />} />
            </Route>

            {/* Shared Sessions restricted to Teacher role */}
            <Route
              element={<RoleProtectedRoute allowedRoles={[Role.TEACHER]} />}
            >
              <Route
                path="/shared-test-sessions"
                element={<SharedSessions />}
              />
            </Route>

            {/* Admin-only routes */}
            <Route element={<RoleProtectedRoute allowedRoles={[Role.ADMIN]} />}>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
};
