import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./components/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {" "}
      {/*  Ensures theme is applied globally */}
      <CssBaseline /> {/*  Resets global styles for consistency */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
