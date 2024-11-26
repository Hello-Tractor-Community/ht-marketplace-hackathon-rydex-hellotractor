// ** MUI Imports
import { Theme } from "@mui/material/styles";
import { AllColorsType } from "../palette";

const Button = (theme: Theme): Theme["components"] => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 5,
          lineHeight: 1.71,
          letterSpacing: "0.3px",
          padding: `${theme.spacing(1.875, 3)}`,
        },
        contained: {
          boxShadow: theme.shadows[3],
          padding: `${theme.spacing(1.875, 5.5)}`,
        },
        outlined: {
          padding: `${theme.spacing(1.625, 5.25)}`,
        },
        sizeSmall: {
          padding: `${theme.spacing(1, 2.25)}`,
          "&.MuiButton-contained": {
            padding: `${theme.spacing(1, 3.5)}`,
          },
          "&.MuiButton-outlined": {
            padding: `${theme.spacing(0.75, 3.25)}`,
          },
        },
        sizeLarge: {
          padding: `${theme.spacing(2.125, 5.5)}`,
          "&.MuiButton-contained": {
            padding: `${theme.spacing(2.125, 6.5)}`,
          },
          "&.MuiButton-outlined": {
            padding: `${theme.spacing(1.875, 6.25)}`,
          },
        },
      },
      variants: (Object.keys(theme.palette) as AllColorsType[]).map(
        (color) => ({
          props: { variant: "containedLight", color },
          style: {
            backgroundColor: theme.palette[color ?? "primary"].light,
            color: theme.palette[color ?? "primary"].main,
            boxShadow: theme.shadows[3],
            "&:hover": {
              boxShadow: theme.shadows[3],
              backgroundColor: theme.palette[color ?? "primary"].light + "aa",
            },
          },
        })
      ),
    },
  };
};

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    containedLight: true;
  }
}

export default Button;