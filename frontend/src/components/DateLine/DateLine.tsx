import { Box, Stack, SxProps, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  date: string;
  sx?: SxProps;
};

const DateLine: FC<Props> = ({ date, sx }) => {
  return (
    <Stack
      direction="row"
      spacing={6}
      sx={{
        alignItems: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          bgcolor: "text.primary",
          width: "5%",
          height: "1px",
        }}
      />
      <Typography
        variant="h5"
        sx={{
          width: "fit-content",
        }}
      >
        {date}
      </Typography>
      <Box
        sx={{
          bgcolor: "text.primary",
          flexGrow: 1,
          height: "1px",
        }}
      />
    </Stack>
  );
};

export default DateLine;
