import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  Popover,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Theme,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/htorange.png";
import logoSmall from "../../assets/images/logoSmall.png";

import LoginDialog from "../../components/Auth/loginDialog";
import { useContext, useState } from "react";
import apiClient from "../../utils/apiClient";
import { useAuth } from "../../hooks/useAuth";
import SearchTextField from "../../components/Search/searchTextField";
import { Logout, Store, ShoppingCart, ListAlt } from "@mui/icons-material";
import { Mail, ShoppingBag } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import Footer from "../../components/LandingPage/footer";
import MenuIcon from "@mui/icons-material/Menu";

const BuyerLayout = () => {
  const { loggedIn, setLoggedIn, authData } = useAuth("buyer");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const { itemCount } = useContext(CartContext);
  const navigate = useNavigate();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  return (
    <Stack
      sx={{
        bgcolor: "background.default",
        height: "100vh",
      }}
    >
      <AppBar
        position="relative"
        sx={{ backgroundColor: "white", boxShadow: 3, zIndex: 100 }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Box component={"a"} href="/">
              <Box
                component={"img"}
                src={isMobile ? logoSmall : logo}
                sx={{
                  width: { xs: 50, md: 200 },
                  height: 75,
                  objectFit: "contain",
                  mr: {
                    xs: 6,
                    md: 0,
                  },
                }}
              ></Box>
            </Box>
          </Stack>
          {isMobile ? (
            <>
              <SearchTextField />

              <IconButton
                edge="start"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{
                  ml: 6,
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
              >
                <List>
                  <ListItem component="a" href="/shop">
                    <ListItemIcon>
                      <Store />
                    </ListItemIcon>
                    <ListItemText primary="Browse" />
                  </ListItem>
                  <ListItem component="a" href="/seller/login">
                    <ListItemIcon>
                      <ShoppingCart />
                    </ListItemIcon>
                    <ListItemText primary="Sell" />
                  </ListItem>
                  <ListItem component="a" href="/stores">
                    <ListItemIcon>
                      <Store />
                    </ListItemIcon>
                    <ListItemText primary="Dealers" />
                  </ListItem>
                  <ListItem component="a" href="/orders">
                    <ListItemIcon>
                      <ListAlt />
                    </ListItemIcon>
                    <ListItemText primary="My Orders" />
                  </ListItem>
                  {loggedIn && (
                    <ListItem component="a" href="/messages">
                      <ListItemIcon>
                        <Mail />
                      </ListItemIcon>
                      <ListItemText primary="Messages" />
                    </ListItem>
                  )}
                  <ListItem component="a" href="/cart">
                    <ListItemIcon>
                      <ShoppingBag />
                    </ListItemIcon>
                    <ListItemText primary="Cart" />
                  </ListItem>
                  {loggedIn ? (
                    <ListItem
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
                      <ListItemText primary="Log out" />
                    </ListItem>
                  ) : (
                    <ListItem
                      onClick={() => {
                        setLoginDialogOpen(true);
                      }}
                    >
                      <ListItemText primary="Login/Register" />
                    </ListItem>
                  )}
                </List>
              </Drawer>
            </>
          ) : (
            <Stack
              direction={"row"}
              sx={{
                flexGrow: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
              spacing={3}
            >
              <SearchTextField />
              <Stack direction="row" spacing={3}>
                <Button href="/shop" sx={{ color: "black" }}>
                  Browse
                </Button>
                <Button href="/seller/login" sx={{ color: "black" }}>
                  Sell
                </Button>
                <Button href="/stores" sx={{ color: "black" }}>
                  Dealers
                </Button>
                <Button href="/orders" sx={{ color: "black" }}>
                  My Orders
                </Button>
              </Stack>
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  alignItems: "center",
                }}
              >
                {loggedIn && (
                  <IconButton
                    href="/messages"
                    sx={{
                      aspectRatio: 1,
                      height: "fit-content",
                    }}
                  >
                    <Mail />
                  </IconButton>
                )}
                <Badge badgeContent={itemCount} color="primary">
                  <IconButton
                    href="/cart"
                    sx={{
                      aspectRatio: 1,
                      height: "fit-content",
                    }}
                  >
                    <ShoppingBag />
                  </IconButton>
                </Badge>
                {loggedIn ? (
                  <>
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
                    </IconButton>{" "}
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
                          <Typography variant="body2">
                            {authData.user?.email}
                          </Typography>
                        </Stack>
                        <Divider sx={{ my: 2 }} />

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
                  </>
                ) : (
                  <Button
                    color="inherit"
                    sx={{ color: "black" }}
                    onClick={() => {
                      setLoginDialogOpen(true);
                    }}
                  >
                    Login/Register
                  </Button>
                )}
              </Stack>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Stack
        sx={{
          // p: 4,
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Stack>
          <Outlet />
          <Footer />
        </Stack>
      </Stack>
      <LoginDialog
        open={loginDialogOpen}
        setOpen={setLoginDialogOpen}
        platform="buyer"
        onLogin={() => {
          console.log("Yippie!");
        }}
      />
    </Stack>
  );
};

export default BuyerLayout;
