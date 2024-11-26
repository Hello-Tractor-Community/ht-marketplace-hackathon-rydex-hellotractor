// ** Type Imports
import { PaletteMode, PaletteOptions } from "@mui/material";

export type CustomColorsType = "pink" | "yellow" | "orange" | "green";
export type AllColorsType =
  | CustomColorsType
  | "primary"
  | "secondary"
  | "info"
  | "warning"
  | "error"
  | "success";
export type CustomColorsPropsOverrides = {
  pink: true;
  yellow: true;
  orange: true;
  green: true;
};
export const CustomColors = ["pink", "yellow", "orange", "green"];

const DefaultPalette = (mode: PaletteMode): PaletteOptions => {
  const lightColor = "0, 0, 0";
  const darkColor = "231, 227, 252";
  const mainColor = mode === "light" ? lightColor : darkColor;

  return {
    common: {
      black: "#000",
      white: "#FFF",
    },
    mode: mode,
    primary: {
      main: "#ff6537",
      light: "#FF9D7F",
      dark: "#C82F00",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#602660",
      light: "#C265C2",
      dark: "#3D183D",
      contrastText: "#FFF",
    },
    info: {
      main: "#379ae6",
      light: "#f1f8fd",
      dark: "#092c47",
    },
    warning: {
      main: "#efb034",
      light: "#fef9ee",
      dark: "#221803",
      contrastText: "#FFF",
    },
    error: {
      main: "#de3b40",
      light: "#fdf2f2",
      dark: "#36090b",
    },
    success: {
      main: "#1dd75b",
      light: "#eefdf3",
      dark: "#041e0d",
      contrastText: "#FFF",
    },
    pink: {
      main: "#ff56a5",
      light: "#ffc9e2",
      dark: "#81003c",
      contrastText: "#FFF",
    },
    yellow: {
      main: "#ffd317",
      light: "#fff0af",
      dark: "#5e4c00",
      contrastText: "#FFF",
    },
    orange: {
      main: "#f9623e",
      light: "#fdcfc4",
      dark: "#731a04",
      contrastText: "#FFF",
    },
    green: {
      main: "#62cd14",
      light: "#ccf7ae",
      dark: "#234907",
      contrastText: "#FFF",
    },

    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#D5D5D5",
      A200: "#AAAAAA",
      A400: "#616161",
      A700: "#303030",
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.38)`,
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === "light" ? "#FFF" : "#312D4B",
      default: mode === "light" ? "#F2F2F2" : "#28243D",
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.3)`,
      disabledBackground: `rgba(${mainColor}, 0.18)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  };
};

export default DefaultPalette;
