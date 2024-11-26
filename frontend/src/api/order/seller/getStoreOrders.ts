import apiClient from "../../../utils/apiClient";
import { Order } from "../placeOrder";

export const getStoreOrders = async (
  storeId: string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
) => {
  const response = await apiClient.get<Order[]>(`/store/${storeId}/order`, {
    params,
  });

  return response.data;
};

export const getStoreOrder = async (
  storeId: string | number,
  orderId: string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
) => {
  const response = await apiClient.get<Order>(
    `/store/${storeId}/order/${orderId}`,
    { params }
  );

  return response.data;
};

export const getAdminOrders = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
) => {
  const response = await apiClient.get<Order[]>(`/admin/order`, {
    params,
  });

  return response.data;
};
