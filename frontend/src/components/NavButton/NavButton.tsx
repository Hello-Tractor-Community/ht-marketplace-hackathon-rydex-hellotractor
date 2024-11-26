import { Box, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  iconSrc?: string;
  selected?: boolean;
  href?: string;
  title?: string;
  onClick?: () => void;
};
const NavButton: FC<Props> = ({
  icon,
  iconSrc,
  selected,
  href,
  title,
  onClick,
}) => {
  return (
    <Stack
      component={onClick ? "div" : "a"}
      direction={"row"}
      sx={{
        bgcolor: selected ? "primary.main" : "transparent",
        color: (theme) => (selected ? "white" : theme.palette.text.primary),
        width: "100%",
        // boxShadow: selected ? 1 : 0,
        p: 2,
        "&:hover": {
          bgcolor: (theme) => theme.palette.primary.light + "aa",
          color: (theme) => theme.palette.primary.main,
          // boxShadow: 2,
        },
        "&:active": {
          bgcolor: (theme) => theme.palette.primary.main + "44",
          // boxShadow: 3,
        },
        borderRadius: 1,
        textDecoration: "none",
        transition: "all 0.2s ease-in-out",
        userSelect: "none",
      }}
      href={href}
      spacing={2}
      onClick={onClick}
    >
      {iconSrc ? <Box component={"img"} src={iconSrc} alt="icon" /> : icon}
      <Typography fontWeight={500} color="inherit">
        {title}
      </Typography>
    </Stack>
  );
};

export default NavButton;
