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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Game from "./components/Game";
import Login from "./components/Login";
import Home from "./components/Home";
import { useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#E0C2FF",
    },
    secondary: {
      main: "#EC733D",
    },
    background: {
      default: "#2E2F30",
      paper: "#28292C",
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFFFFF",
    },
    secondary: {
      main: "#6F4A7D",
    },
    background: {
      default: "#ebebf0",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6F4A7D",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#6F4A7D",
          "&.Mui-focused": {
            color: "#6F4A7D",
          },
        },
      },
    },
  },
});

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider
      theme={darkMode ? darkTheme : lightTheme}
      defaultMode="light"
    >
      <CssBaseline />
      <Router>
        <AppHeader
          setIsOpen={setIsOpen}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
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
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
