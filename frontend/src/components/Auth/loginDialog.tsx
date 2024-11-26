import {
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import apiClient, { Platform, User } from "../../utils/apiClient";
import { toast } from "../../utils/toast";
import { AuthContext } from "../../context/AuthContext";
import CoolButton from "../CoolButton/CoolButton";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  platform: Platform;
  onLogin?: () => void;
};
const LoginDialog: FC<Props> = ({ open, setOpen, platform, onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [fbLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const { setAuthData, setLoggedIn } = useContext(AuthContext);

  const onSubmit = async (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (isNewUser) {
        if (platform === "admin") {
          toast({
            message: "Admin accounts can only be created by the system",
            severity: "error",
          });
          throw new Error("Admin accounts can only be created by the system");
        }

        if (password !== confirmPassword) {
          toast({
            message: "Passwords do not match",
            severity: "error",
          });
          throw new Error("Passwords do not match");
        }
      }
      await apiClient.post(
        isNewUser ? "/user/auth/register/email" : "/user/auth/login",
        {
          email,
          password,
          name,
        }
      );

      postLogin();

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const postLogin = async () => {
    if (isNewUser) {
      switch (platform) {
        case "seller":
          await apiClient.post("/seller/auth/create");
          break;
        case "buyer":
          await apiClient.post("/buyer/auth/create");
          break;
      }
    }
    const user = (await apiClient.get<User>("/user/auth/me")).data;

    setLoggedIn(true);

    switch (platform) {
      case "seller":
        setAuthData({ platform: "seller", user });
        //   setSelectStoreDialogOpen(true);

        break;

      case "admin":
        setAuthData({ platform: "admin", user });
        //   navigate("/admin");
        break;

      default:
        setAuthData({ platform: "buyer", user });
        //   navigate("/");
        break;
    }
    onLogin?.();
  };

  // const handleFacebookLogin = async () => {
  //   try {
  //     setFbLoading(true);

  //     let authResponse: AuthResponse = await new Promise((resolve) => {
  //       window.FB.getLoginStatus((response: AuthResponse) => {
  //         resolve(response);
  //       });
  //     });
  //     console.log(authResponse);

  //     if (authResponse.status === "unknown") {
  //       authResponse = await new Promise((resolve) => {
  //         window.FB.login((response: AuthResponse) => {
  //           resolve(response);
  //         });
  //       });
  //     }

  //     const { email, name }: { name: string; email: string } =
  //       await new Promise((resolve) => {
  //         window.FB.api(
  //           "/me",
  //           { fields: "name,email" },
  //           (response: { name: string; email: string }) => {
  //             resolve(response);
  //           }
  //         );
  //       });

  //     console.log(email, name);

  //     await apiClient.post("/user/auth/facebook", {
  //       email,
  //       name,
  //       accessToken: authResponse.authResponse.accessToken,
  //     });

  //     postLogin();
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   setFbLoading(false);
  // };

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={() => {}}
      component={"form"}
      onSubmit={onSubmit}
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <Stack sx={{ pt: 2 }}>
          <Collapse in={isNewUser}>
            <TextField
              label="Name"
              variant="outlined"
              sx={{ width: "100%", mb: 4 }}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Collapse>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            sx={{ mb: 4 }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            sx={{ mb: 4 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Collapse in={isNewUser}>
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              sx={{ width: "100%", mb: 4 }}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </Collapse>
          <CoolButton
            shadowHighlight={true}
            variant="contained"
            color="primary"
            sx={{ width: "100%", mb: 4 }}
            size="large"
            type="submit"
            startIcon={loading && <CircularProgress size={16} />}
            disabled={fbLoading || loading}
          >
            {isNewUser ? "Create Account" : "Login"}
          </CoolButton>
          <CoolButton
            shadowHighlight={false}
            variant="outlined"
            color="primary"
            sx={{ width: "100%", mb: 4 }}
            size="large"
            onClick={() => {
              setIsNewUser((prev) => !prev);
            }}
            disabled={fbLoading || loading}
          >
            {isNewUser
              ? "Log in with an existing account"
              : "Create a new Account"}
          </CoolButton>

          {/* <CoolButton
            shadowHighlight={false}
            variant="outlined"
            color="primary"
            sx={{ width: "100%", mb: 4 }}
            size="large"
            onClick={() => {
              handleFacebookLogin();
            }}
            disabled={fbLoading || loading}
            startIcon={
              fbLoading ? <CircularProgress size={16} /> : <Facebook />
            }
          >
            Log in with facebook
          </CoolButton> */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={fbLoading || loading}
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
