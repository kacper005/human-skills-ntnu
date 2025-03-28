import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      gradients: {
        primary: string;
        secondary: string;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      gradients?: {
        primary: string;
        secondary: string;
      };
    };
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#37166f",
      light: "#9C7FB7",
      dark: "#4A2A53",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#EC733D",
      light: "#FFA07A",
      dark: "#B54A1D",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#ebebf0",
      paper: "#ffffff",
    },
    text: {
      primary: "#2E2F30",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: ["Montserrat", "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
      lineHeight: 1.75,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 6,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.1)",
    "0px 4px 8px rgba(0,0,0,0.15)",
    "0px 8px 16px rgba(0,0,0,0.2)",
    "0px 12px 24px rgba(0,0,0,0.25)",
    "0px 16px 32px rgba(0,0,0,0.3)",
    "0px 20px 40px rgba(0,0,0,0.35)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
    "0px 24px 48px rgba(0,0,0,0.4)",
  ],
  custom: {
    gradients: {
      primary: "linear-gradient(45deg, #6F4A7D, #EC733D)",
      secondary: "linear-gradient(135deg, #EC733D, #6F4A7D)",
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
export type CustomTheme = typeof theme;
