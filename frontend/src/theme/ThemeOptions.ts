// ** MUI Theme Provider
import { ThemeOptions } from "@mui/material";

// ** Theme Override Imports
import palette from "./palette";
import spacing from "./spacing";
import shadows from "./shadows";
import breakpoints from "./breakpoints";
import { Settings } from "../context/SettingsContext";

const themeOptions = (settings: Settings): ThemeOptions => {
  // ** Vars
  const { mode } = settings;

  const themeConfig = {
    palette: palette(mode),
    typography: {
      fontFamily: [
        "Inter",
        "sans-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    shadows: shadows(mode),
    ...spacing,
    breakpoints: breakpoints(),
    shape: {
      borderRadius: 6,
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
  };

  return themeConfig;
};

export default themeOptions;
