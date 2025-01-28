import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AppHeader from "./components/AppHeader";
import "./App.css";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import GameCardGrid from "./components/GameCardGrid";
import Game from "./components/Game";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#FF5733",
        },
        // ...other tokens
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#E0C2FF",
        },
        // ...other tokens
      },
    },
  },
});

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppHeader />
        <Offset />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<GameCardGrid />} />
          <Route path="/game" element={<Game />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
