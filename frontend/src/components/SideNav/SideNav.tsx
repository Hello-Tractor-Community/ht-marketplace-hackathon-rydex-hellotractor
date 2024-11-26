import { Box, Chip, Divider, Paper, Stack } from "@mui/material";
import { FC, useContext } from "react";
import { NavContext } from "../../context/NavContext";
import NavButton from "../NavButton/NavButton";
import { NavMenuItem } from "../../navigation/navMenu";
import { Logout } from "@mui/icons-material";
import apiClient from "../../utils/apiClient";
import { matchPath, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/htorange.png";

const SideNav: FC = () => {
  const { navMenu } = useContext(NavContext);
  const { setLoggedIn, authData } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          width: "fit-content",
          height: "100vh",

          flexShrink: 0,
          p: 4,
          pr: 2,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 1,
            // m: 2,
            boxShadow: 3,
            overflow: "auto",
          }}
        >
          <Stack sx={{ px: 2 }}>
            <Box component={"a"} href="/">
              <Box
                component={"img"}
                src={logo}
                sx={{
                  width: 150,
                  height: 75,
                  objectFit: "contain",
                }}
              ></Box>
            </Box>
            <Chip
              size="small"
              color="primary"
              sx={{
                fontFamily: "inherit",
                mb: 3,
              }}
              label={`${authData.platform.toUpperCase()} PORTAL`}
              variant="outlined"
            />
            <Divider />
            <Stack spacing={2} sx={{ mt: 3 }}>
              {navMenu.map((item) => {
                if (item.separator) {
                  return <Divider />;
                }
                const i = item as NavMenuItem;

                const pathname = window.location.pathname;

                return (
                  <NavButton
                    title={i.label}
                    href={i.path}
                    icon={i.icon}
                    key={"navItem" + i.label}
                    selected={!!matchPath(pathname ?? "", i.path)}
                  />
                );
              })}
              <NavButton
                title={"Log out"}
                onClick={() => {
                  apiClient.post("/user/auth/logout").then(() => {
                    navigate("/");
                    setLoggedIn(false);
                  });
                }}
                icon={<Logout />}
              />
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default SideNav;
