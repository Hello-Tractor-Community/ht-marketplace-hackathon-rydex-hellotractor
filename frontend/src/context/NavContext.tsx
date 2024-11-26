import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { NavItem } from "../navigation/navMenu";
import { Platform } from "../utils/apiClient";

export type NavContextType = {
  navMenu: NavItem[];
  setNavMenu: Dispatch<SetStateAction<NavItem[]>>;
  platform: Platform;
  setPlatform: Dispatch<SetStateAction<Platform>>;
};
export const NavContext = createContext<NavContextType>({
  navMenu: [],
  setNavMenu: () => {},
  platform: "buyer",
  setPlatform: () => {},
});

type Props = {
  children?: ReactNode[] | ReactNode;
};

const NavProvider: FC<Props> = ({ children }) => {
  const [navMenu, setNavMenu] = useState<NavItem[]>([]);
  const [platform, setPlatform] = useState<Platform>("buyer");

  return (
    <NavContext.Provider
      value={{
        navMenu,
        setNavMenu,

        platform,
        setPlatform,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export default NavProvider;
