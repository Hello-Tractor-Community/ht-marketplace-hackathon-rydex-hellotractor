import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { ElementType, FC, useEffect, useState } from "react";

type Props = {
  appId: string;
  config_id: string;
  onLogin?: (response: AuthResponse) => void;
  onInit?: (response: AuthResponse) => void;
};

export type AuthResponse = {
  status: string;
  authResponse: {
    accessToken: string;
    expiresIn: number;
    data_access_expiration_time: number;
    signedRequest: string;
    userID: string;
  };
};
const LoginWithFacebook: FC<Props> = ({
  appId,
  config_id,
  onLogin,
  onInit,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: "v20.0", // Use this Graph API version for this call.
      });

      console.log("FB SDK loaded");

      window.FB.getLoginStatus((response: object) => {
        console.log(response);
        onInit?.(response as AuthResponse);
      });
    };

    window.checkLoginState = () => {
      console.log("cheking...");
      window.FB.getLoginStatus((response: AuthResponse) => {
        console.log(response);
        onLogin?.(response);
      });
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    loadScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {scriptLoaded ? (
        <Box
          component={"fb:login-button" as ElementType}
          config_id={config_id}
          onlogin="checkLoginState();"
        ></Box>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <CircularProgress size={16} />
          <Typography>Loading...</Typography>
        </Stack>
      )}
    </Box>
  );
};

export default LoginWithFacebook;
