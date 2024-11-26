"use client";

// ** React Imports
import { ReactNode, useContext } from "react";

// ** MUI Imports
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import {
  Interpolation,
  Theme,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

// ** Theme Override Imports
import overrides from "./overrides";
import typography from "./typography";

// ** Theme
import themeOptions from "./ThemeOptions";

// ** Global Styles
import GlobalStyling from "./globalStyles";
import { SettingsContext } from "../context/SettingsContext";

interface Props {
  children: ReactNode;
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { children } = props;

  const { settings } = useContext(SettingsContext);
  // ** Merged ThemeOptions of Core and User
  const coreThemeConfig = themeOptions(settings);

  // ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
  let theme = createTheme(coreThemeConfig);

  // ** Continue theme creation and pass merged component overrides to CreateTheme function
  theme = createTheme(theme, {
    components: { ...overrides(theme) },
    typography: { ...typography(theme) },
  });

  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={() => GlobalStyling(theme) as Interpolation<Theme>}
      />
      {children}
    </ThemeProvider>
  );
};

export default ThemeComponent;
