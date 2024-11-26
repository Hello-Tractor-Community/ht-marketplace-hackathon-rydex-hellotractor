// ** Theme Type Import
import { Theme } from "@mui/material/styles";

const Typography = (theme: Theme) => {
  return {
    h1: {
      fontWeight: 500,
      letterSpacing: "-1.5px",
      color: theme.palette.text.primary,
      fontFamily: "Lexend",
    },
    h2: {
      fontWeight: 500,
      letterSpacing: "-0.5px",
      color: theme.palette.text.primary,
      fontFamily: "Lexend",
    },
    h3: {
      fontWeight: 500,
      letterSpacing: 0,
      color: theme.palette.text.primary,
      fontFamily: "Lexend",
    },
    h4: {
      fontWeight: 500,
      letterSpacing: "0.25px",
      color: theme.palette.text.primary,
      fontFamily: "Lexend",
    },
    h5: {
      fontWeight: 500,
      letterSpacing: 0,
      color: theme.palette.text.primary,
      fontFamily: "Lexend",
    },
    h6: {
      letterSpacing: "0.15px",
      color: theme.palette.text.primary,
      fontFamily: "Lexend",
    },
    subtitle1: {
      letterSpacing: "0.15px",
      color: theme.palette.text.primary,
      fontFamily: "Manrope",
    },
    subtitle2: {
      letterSpacing: "0.1px",
      color: theme.palette.text.secondary,
      fontFamily: "Manrope",
    },
    body1: {
      letterSpacing: "0.15px",
      color: theme.palette.text.primary,
      fontFamily: "Manrope",
    },
    body2: {
      lineHeight: 1.5,
      letterSpacing: "0.15px",
      color: theme.palette.text.secondary,
      fontFamily: "Manrope",
    },
    button: {
      letterSpacing: "0.3px",
      color: theme.palette.text.primary,
      fontFamily: "Manrope",
    },
    caption: {
      letterSpacing: "0.4px",
      color: theme.palette.text.secondary,
      fontFamily: "Manrope",
    },
    overline: {
      letterSpacing: "1px",
      color: theme.palette.text.secondary,
      fontFamily: "Manrope",
    },
  };
};

export default Typography;
