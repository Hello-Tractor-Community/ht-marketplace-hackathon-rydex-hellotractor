import { Box, BoxProps } from "@mui/material";
import { FC } from "react";

interface ImageProps extends BoxProps {
  src: string;
  alt: string;
  usePublicDir?: boolean;
}
const Image: FC<ImageProps> = ({ usePublicDir = false, src, ...rest }) => {
  return (
    <Box
      component={"img"}
      src={`${usePublicDir ? import.meta.env.BASE_URL : ""}${src}`}
      {...rest}
    />
  );
};

export default Image;
