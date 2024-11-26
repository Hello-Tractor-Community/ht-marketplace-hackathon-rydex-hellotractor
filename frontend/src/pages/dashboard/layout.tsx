import { Stack, Theme, useMediaQuery } from "@mui/material";
import { FC, useContext, useEffect } from "react";
import SideNav from "../../components/SideNav/SideNav";
import { Outlet } from "react-router-dom";
import { Platform } from "../../utils/apiClient";
import { NavContext } from "../../context/NavContext";
import { useAuth } from "../../hooks/useAuth";
import { adminNavMenu } from "../../navigation/navMenu";

type Props = {
  platform: Platform;
};
const DashboardLayout: FC<Props> = ({ platform }) => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const { setNavMenu } = useContext(NavContext);

  useAuth(platform);

  useEffect(() => {
    switch (platform) {
      case "seller":
        break;
      case "admin":
        setNavMenu(adminNavMenu());
        break;
      default:
        setNavMenu([]);
        break;
    }
  }, [platform, setNavMenu]);
  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {!isSm && <SideNav />}
      <Stack
        sx={{
          flexGrow: 1,
          height: "100%",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
