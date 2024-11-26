import axios, { AxiosError } from "axios";
import { toast } from "./toast";
import { Store } from "../api/stores/getStores";
import { Order } from "../api/order/placeOrder";

export type Platform = "seller" | "admin" | "buyer";

export type SellerData = {
  [key: string]: string;
};

export type BuyerData = {
  [key: string]: string;
};

export type Seller = {
  id: number;
  userId: number;
  data?: SellerData;
  user?: User;
  stores: Store[];
  createdAt: string;
  updatedAt: string;
};

export type Buyer = {
  id: number;
  userId: number;
  data?: BuyerData;
  user?: User;
  orders?: Order[];
  createdAt: string;
  updatedAt: string;
};

export type UserData = {
  [key: string]: string;
};

export type User = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  data?: UserData;
  image?: string;
  sellers?: Seller[];
  createdAt: string;
  updatedAt: string;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export type DefaultApiError = {
  message?: string;
};

apiClient.interceptors.response.use(
  undefined,
  (error: AxiosError<DefaultApiError>) => {
    if (
      error.response?.status === 401 &&
      error.config?.url !== "/user/auth/login" &&
      error.config?.url !== "/user/auth/register/email" &&
      error.config?.url !== "/user/auth/me"
    ) {
      toast({
        message: "Session expired, please login again",
        severity: "warning",
      });
      window.location.href = "/";
    } else {
      if (error.config?.url !== "/user/auth/me") {
        toast({
          message: error.response?.data?.message ?? error.message,
          severity: "error",
        });
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
