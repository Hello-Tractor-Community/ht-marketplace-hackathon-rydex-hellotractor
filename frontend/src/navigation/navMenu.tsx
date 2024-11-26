import {
  Archive,
  Category,
  Extension,
  Home,
  Message,
  Settings,
  ShoppingCart,
  Store,
} from "@mui/icons-material";
import { ReactNode } from "react";

export type NavMenuItem = {
  path: string;
  icon: ReactNode;
  label: string;
  separator?: boolean;
};

export type NavItem = NavMenuItem;

export const sellerStoreNavMenu = (storeId: number | string): NavMenuItem[] => {
  const prefix = `/seller/stores/${storeId}`;
  return [
    {
      icon: <Home />,
      path: "/",
      label: "Home",
    },
    {
      icon: <Category />,
      path: "/products",
      label: "Products",
    },
    {
      icon: <ShoppingCart />,
      path: "/orders",
      label: "Orders",
    },

    {
      icon: <Message />,
      path: "/messages",
      label: "Messages",
    },
    {
      icon: <Settings />,
      path: "/settings",
      label: "Store Settings",
    },
  ].map((item) => ({ ...item, path: `${prefix}${item.path}` }));
};

export const adminNavMenu = (): NavMenuItem[] => {
  const prefix = `/admin`;
  return [
    {
      icon: <Home />,
      path: "/",
      label: "Home",
    },
    {
      icon: <Category />,
      path: "/products",
      label: "Products",
    },
    {
      icon: <Store />,
      path: "/stores",
      label: "Stores",
    },
    {
      icon: <ShoppingCart />,
      path: "/orders",
      label: "Orders",
    },
  ].map((item) => ({ ...item, path: `${prefix}${item.path}` }));
};

const getNavMenu = async (): Promise<NavItem[]> => {
  return [
    {
      icon: <Home />,
      path: "/",
      label: "Home",
    },
    {
      icon: <Archive />,
      path: "/content",
      label: "Content",
    },
    {
      icon: <Extension />,
      path: "/plugins",
      label: "Plugins",
    },
  ];
};

export default getNavMenu;
