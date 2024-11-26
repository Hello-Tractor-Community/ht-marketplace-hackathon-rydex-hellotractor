// ** MUI Imports
import { Theme } from "@mui/material/styles";

const input = (theme: Theme): Theme["components"] => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&.Mui-disabled:before": {
            borderBottom: `1px solid ${theme.palette.text.disabled}`,
          },
        },
      },
    },
  };
};

export default input;
