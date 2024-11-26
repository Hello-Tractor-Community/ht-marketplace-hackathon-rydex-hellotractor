// ** MUI Imports
import { capitalize } from "@mui/material";
import { Components, Theme, Palette } from "@mui/material/styles";

const Chip = (theme: Theme) => {
  const colors: Array<keyof Palette> = [
    "primary",
    "secondary",
    "error",
    "warning",
    "info",
    "success",
  ];

  const colorOverrides = colors
    .map((color) => ({
      [`&.MuiChip-color${capitalize(color)}`]: {
        //@ts-ignore
        backgroundColor: theme.palette[color].light,
      },
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const obj: Components<Omit<Theme, "components">>["MuiChip"] = {
    styleOverrides: {
      deleteIcon: {
        width: 18,
        height: 18,
      },
      filled: {
        opacity: 0.9,
        boxShadow: theme.shadows[3],
        ...colorOverrides,
      },
    },
  };
  return {
    MuiChip: obj,
  };
};

export default Chip;
