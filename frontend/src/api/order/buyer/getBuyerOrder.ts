import apiClient from "../../../utils/apiClient";
import { Order } from "../placeOrder";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBuyerOrder = async (orderId: string | number, params: any) => {
  const response = await apiClient.get<Order>(`/buyer/order/${orderId}`, {
    params,
  });

  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getBuyerOrders = async (params?: any) => {
  const response = await apiClient.get<Order[]>(`/buyer/order`, {
    params,
  });

  return response.data;
};
