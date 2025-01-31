import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppHeader from "./components/AppHeader";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Game from "./components/Game";
import Login from "./components/Login";
import Home from "./components/Home";
import { useState } from "react";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#FFFFFF",
        },
        secondary: {
          main: "#6F4A7D",
        },
        // ...other tokens
      },
    },
    // dark: {
    //   palette: {
    //     primary: {
    //       main: "#E0C2FF",
    //     },
    //     // ...other tokens
    //   },
    // },
  },
});

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppHeader
          setIsOpen={setIsOpen}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
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
            <Route path="/game/:gameId" element={<Game />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
