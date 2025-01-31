import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppHeader from "./components/AppHeader";
import "./App.css";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Game from "./components/Game";
import Login from "./components/Login";
import Home from "./components/Home";

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

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppHeader />
        {/* <Offset style={{ height: "80px" }} /> */}
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game/:gameId" element={<Game />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
