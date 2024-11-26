import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Platform, User } from "../utils/apiClient";

export type AuthData = {
  platform: Platform;
  user?: User;
};

export type AuthContextType = {
  authData: AuthData;
  setAuthData: Dispatch<SetStateAction<AuthData>>;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  fbLoaded: boolean;
  setFbLoaded: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
  authData: {
    platform: "buyer",
  },
  setAuthData: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
  fbLoaded: false,
  setFbLoaded: () => {},
});

type Props = {
  children?: ReactNode[] | ReactNode;
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

const AuthProvider: FC<Props> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({
    platform: "buyer",
  });
  const [loggedIn, setLoggedIn] = useState(false);

  const [fbLoaded, setFbLoaded] = useState(false);

  const loadScript = () => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.onload = () => {
      setFbLoaded(true);
    };

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1107099761123875",
        // cookie: true, // Enable cookies to allow the server to access the session.
        xfbml: true, // Parse social plugins on this webpage.
        version: "v21.0", // Use this Graph API version for this call.
      });

      console.log("FB SDK loaded");

      window.FB.getLoginStatus((response: object) => {
        console.log(response);
      });
    };

    window.checkLoginState = () => {
      console.log("cheking...");
      window.FB.getLoginStatus((response: AuthResponse) => {
        console.log(response);
        // onLogin?.(response);
      });
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    loadScript();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        loggedIn,
        setLoggedIn,
        fbLoaded,
        setFbLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
    fbAsyncInit: () => void;
    checkLoginState: () => void;
  }
}
