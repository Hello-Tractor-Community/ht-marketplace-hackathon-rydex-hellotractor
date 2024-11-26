import { useContext, useEffect } from "react";
import apiClient, { Platform, User } from "../utils/apiClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useAuth = (platform: Platform) => {
  const context = useContext(AuthContext);
  const { authData, setAuthData, setLoggedIn } = context;

  const navigate = useNavigate();

  useEffect(() => {
    if (authData.platform !== platform) {
      setAuthData({ platform });
    }

    apiClient
      .get<User>("/user/auth/me")
      .then(({ data }) => {
        setAuthData({ platform, user: data });
        setLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
        setLoggedIn(false);

        switch (platform) {
          case "seller":
            navigate("/seller/login");
            break;
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  return context;
};
