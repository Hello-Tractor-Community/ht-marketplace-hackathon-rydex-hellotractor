import {
  Card,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import loginBackground from "./../assets/images/loginBackground.svg";
import Image from "../components/Image";
import CoolButton from "../components/CoolButton/CoolButton";
import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { Platform, User } from "../utils/apiClient";
import { toast } from "../utils/toast";
import { AuthContext } from "../context/AuthContext";
import SelectStoreDialog from "../components/Stores/SelectStoreDialog";
import CreateStoreDialog from "../components/Stores/StoreDialog";

type Props = {
  platform: Platform;
};

const LoginPage: FC<Props> = ({ platform }) => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectStoreDialogOpen, setSelectStoreDialogOpen] = useState(false);
  const [createStoreDialogOpen, setCreateStoreDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const { setAuthData, setLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLogin = async () => {
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
      setLoggedIn(true);

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

      switch (platform) {
        case "seller":
          setAuthData({ platform: "seller", user });
          if (isNewUser) {
            setCreateStoreDialogOpen(true);
          } else {
            setSelectStoreDialogOpen(true);
          }
          break;

        case "admin":
          setAuthData({ platform: "admin", user });
          navigate("/admin");
          break;

        default:
          setAuthData({ platform: "buyer", user });
          navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <Stack
      sx={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Image
        src={loginBackground}
        alt="background"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -1,
          objectFit: "cover",
        }}
      ></Image>
      <Card sx={{ minHeight: "60vh" }}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            p: 8,
            "& > *": {
              width: "100%",
              maxWidth: "400px",
            },
            transition: "all 0.3s",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            {isNewUser ? "Create a new account" : "Login"}
          </Typography>
          {!isNewUser && (
            <Typography variant="caption" sx={{ mb: 1 }}>
              {(() => {
                switch (platform) {
                  case "admin":
                    return "Log in to the admin dashboard";
                  case "buyer":
                    return "";
                  case "seller":
                    return "Log in to the seller dashboard ";
                }
              })()}
            </Typography>
          )}
          <Divider sx={{ mb: 4 }} />
          <Collapse in={isNewUser}>
            <TextField
              label="Name"
              variant="filled"
              sx={{ width: "100%", mb: 4 }}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Collapse>
          <TextField
            label="Email"
            variant="filled"
            type="email"
            sx={{ mb: 4 }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            label="Password"
            variant="filled"
            type="password"
            sx={{ mb: 4 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Collapse in={isNewUser}>
            <TextField
              label="Confirm Password"
              variant="filled"
              type="password"
              sx={{ width: "100%" }}
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </Collapse>
          <Stack
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remember me"
            />
            <CoolButton>Forgot password?</CoolButton>
          </Stack>
          <CoolButton
            shadowHighlight={true}
            variant="contained"
            color="primary"
            sx={{ width: "100%", mb: 4 }}
            size="large"
            onClick={handleLogin}
            startIcon={loading && <CircularProgress size={16} />}
            disabled={loading}
          >
            {isNewUser ? "Create Account" : "Login"}
          </CoolButton>
          {platform !== "admin" && (
            <CoolButton
              shadowHighlight={false}
              variant="outlined"
              color="primary"
              sx={{ width: "100%", mb: 4 }}
              size="large"
              onClick={() => {
                setIsNewUser((prev) => !prev);
              }}
              disabled={loading}
            >
              {isNewUser
                ? "Log in with an existing account"
                : "Create a new Account"}
            </CoolButton>
          )}
        </Stack>
      </Card>
      <SelectStoreDialog
        open={selectStoreDialogOpen}
        setOpen={setSelectStoreDialogOpen}
        disableClose
      />
      <CreateStoreDialog
        open={createStoreDialogOpen}
        setOpen={setCreateStoreDialogOpen}
        disableClose
        onCreate={(store) => {
          setCreateStoreDialogOpen(false);
          navigate("/seller/stores/" + store.id);
        }}
      />
    </Stack>
  );
};

export default LoginPage;
