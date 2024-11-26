import { CustomColorsPropsOverrides } from "../../theme/palette";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { ReactNode } from "react";

// Only include variant, size, and color
type ButtonBaseProps = MuiButtonProps;

// Use all except disableRipple
// type ButtonBaseProps = Omit<MuiButtonProps, "disableRipple">;

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides extends CustomColorsPropsOverrides {}
}

export interface ButtonProps extends ButtonBaseProps {
  children?: ReactNode | ReactNode[];
  shadowHighlight?: boolean;
  variant?: "contained" | "containedLight" | "outlined" | "text";
}

const CoolButton = ({
  children,
  color,
  shadowHighlight,
  variant,
  ...rest
}: ButtonProps) => (
  <MuiButton
    {...{
      color,
      variant,
      ...rest,
    }}
    sx={{
      ...((variant === "contained" || variant === "containedLight") &&
      shadowHighlight
        ? {
            boxShadow: (theme) =>
              `0px 4px 8px -4px ${theme.palette[!color || color === "inherit" ? "primary" : color].main}`,
            "&:hover": {
              boxShadow: (theme) =>
                `0px 6px 12px -4px ${theme.palette[!color || color === "inherit" ? "primary" : color].main}`,
            },
          }
        : {}),
      ...rest.sx,
    }}
  >
    {children}
  </MuiButton>
);

export default CoolButton;
