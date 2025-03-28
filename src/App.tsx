import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppHeader from "./components/AppHeader";
import UserAccount from "./components/UserAccount";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "./components/theme";
import Game from "./components/Game";
import Login from "./components/Login";
import Home from "./components/Home";
import { useState, useMemo } from "react";
import Questionnaire from "./components/Questionnaire";
import IntFluidController from "./components/games/intFluid/IntFluidController";

//  Function to dynamically switch between light and dark mode
const getTheme = (darkMode: boolean) =>
  createTheme({
    ...theme, // Spread the existing theme properties
    palette: {
      ...theme.palette,
      mode: darkMode ? "dark" : "light", // Dynamically switch mode
    },
  });

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false); //  Dark mode state

  //  Memoize the theme to prevent unnecessary re-renders
  const muiTheme = useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline /> {/* MUI global styling reset */}
      <Router>
        <AppHeader
          setIsOpen={setIsOpen}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode} //  Pass dark mode toggle function to header
        />
        <Login
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setIsLoggedIn={setIsLoggedIn}
        />
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/account" element={<UserAccount />} />
            <Route path="/game" element={<Game />} />
            <Route path="/test" element={<Questionnaire />} />
            <Route path="/test2" element={<IntFluidController />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
