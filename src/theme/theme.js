import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A1A1A",
      light: "#333333",
      dark: "#000000",
    },
    secondary: {
      main: "#C8A97E",
      light: "#D4BA95",
      dark: "#A8835A",
    },
    background: {
      default: "#FAFAF8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B6B6B",
    },
    success: {
      main: "#4CAF50",
    },
    error: {
      main: "#E53935",
    },
  },
  typography: {
    fontFamily: "'Syne', 'DM Sans', sans-serif",
    h1: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'DM Sans', sans-serif",
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: "'DM Sans', sans-serif",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          padding: "12px 28px",
          fontSize: "0.875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
        },
        containedPrimary: {
          background: "#1A1A1A",
          color: "#FFFFFF",
          "&:hover": {
            background: "#C8A97E",
            transform: "translateY(-1px)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          },
        },
        containedSecondary: {
          background: "#C8A97E",
          color: "#FFFFFF",
          "&:hover": {
            background: "#A8835A",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor: "#1A1A1A",
          color: "#1A1A1A",
          "&:hover": {
            background: "#1A1A1A",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "2px",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          boxShadow: "none",
          border: "1px solid #EBEBEB",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          background: "#C8A97E",
          color: "#FFFFFF",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "2px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#C8A97E",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1A1A1A",
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: "#C8A97E",
          height: "2px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Syne', sans-serif",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          "&.Mui-selected": {
            color: "#1A1A1A",
          },
        },
      },
    },
  },
});

export default theme;
