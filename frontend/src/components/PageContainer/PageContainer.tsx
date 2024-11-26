import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { FC, useContext, useState } from "react";
import ThemeConstants from "../../theme/constants";
import { Logout, Menu, SwapHoriz } from "@mui/icons-material";
import { NavContext } from "../../context/NavContext";
import { NavMenuItem } from "../../navigation/navMenu";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { AuthContext } from "../../context/AuthContext";
import SelectStoreDialog from "../Stores/SelectStoreDialog";

type Props = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};
const PageContainer: FC<Props> = ({ title, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { navMenu } = useContext(NavContext);
  const { setLoggedIn, authData } = useContext(AuthContext);
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  const navigate = useNavigate();

  const xs = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      {xs && (
        <>
          <Drawer
            open={drawerOpen}
            onClose={() => {
              setDrawerOpen(false);
            }}
          >
            <Box sx={{ width: 250 }} role="presentation">
              <List>
                {navMenu.map((item) => {
                  if (item.separator) {
                    return <Divider />;
                  }
                  const i = item as NavMenuItem;

                  return (
                    <ListItem key={"navItem" + i.label} disablePadding>
                      <ListItemButton
                        LinkComponent={"a"}
                        // selected={pathname === i.path}
                        onClick={() => {
                          navigate(i.path);
                        }}
                      >
                        <ListItemIcon>{i.icon}</ListItemIcon>
                        <ListItemText primary={i.label} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}

                <ListItem disablePadding>
                  <ListItemButton
                    LinkComponent={"a"}
                    onClick={() => {
                      apiClient.post("/user/auth/logout").then(() => {
                        navigate("/");
                        setLoggedIn(false);
                      });
                    }}
                  >
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary={"Log out"} />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </>
      )}
      <Stack
        direction={"row"}
        sx={{
          alignItems: "center",
          height: `${ThemeConstants.topNavHeight}px`,
          p: 8,
          pl: 4,
          justifyContent: "space-between",
        }}
        spacing={3}
      >
        <Stack direction={"row"} spacing={3} sx={{}}>
          {xs && (
            <IconButton
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h3">{title}</Typography>
        </Stack>
        <Stack
          direction={"row"}
          spacing={3}
          sx={{
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleAvatarClick} size="small">
            <Avatar
              src={authData.user?.image}
              sx={{
                bgcolor: "secondary.light",
                color: "primary.contrastText",
              }}
            >
              {authData.user?.name?.[0]}
            </Avatar>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack sx={{ py: 4, minWidth: "200px" }}>
              <Stack
                sx={{
                  px: 4,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "700",
                  }}
                >
                  {authData.user?.name}
                </Typography>
                <Typography variant="body2">{authData.user?.email}</Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              {authData.platform === "seller" && (
                <ListItemButton
                  onClick={() => {
                    setStoreDialogOpen(true);
                  }}
                >
                  <ListItemIcon>
                    <SwapHoriz fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Switch Stores</Typography>
                </ListItemButton>
              )}
              <ListItemButton
                onClick={() => {
                  apiClient.post("/user/auth/logout").then(() => {
                    navigate("/");
                    setLoggedIn(false);
                  });
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Log out</Typography>
              </ListItemButton>
            </Stack>
          </Popover>
        </Stack>
      </Stack>
      <Stack
        sx={{
          px: 8,
          pt: 2,
          pl: 4,
          pb: 4,
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        {children}
      </Stack>
      <SelectStoreDialog
        open={storeDialogOpen}
        setOpen={() => {
          setStoreDialogOpen(false);
        }}
      />
    </Stack>
  );
};

export default PageContainer;
