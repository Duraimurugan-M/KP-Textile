// import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#1976D2",
//     },
//     secondary: {
//       main: "#455A64",
//     },
//     background: {
//       default: "#F5F7FA",
//       paper: "#FFFFFF",
//     },
//     error: {
//       main: "#D32F2F",
//     },
//     success: {
//       main: "#2E7D32",
//     },
//     text: {
//       primary: "#263238",
//     },
//   },
//   typography: {
//     fontFamily: "Roboto, Arial, sans-serif",
//     fontSize: 14,
//   },
// });

// export default theme;


import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#800020", // Maroon (Primary Brand Color)
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#5C2A2A", // Muted Maroon / Brownish tone
    },
    background: {
      default: "#F6F3F3", // Light grey with warm tone
      paper: "#FFFFFF",
    },
    error: {
      main: "#B71C1C",
    },
    success: {
      main: "#2E7D32",
    },
    text: {
      primary: "#2B2B2B",
      secondary: "#5F5F5F",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    fontSize: 14,
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // ERP-style (no ALL CAPS)
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F1EAEA",
        },
      },
    },
  },
});

export default theme;
