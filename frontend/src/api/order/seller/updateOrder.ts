import apiClient from "../../../utils/apiClient";
import { Order, OrderProduct } from "../placeOrder";

export const updateStoreOrder = async (
  data: Partial<Order>,
  storeId: string | number,
  orderId: string | number
) => {
  const response = await apiClient.put<Order>(
    `/store/${storeId}/order/${orderId}`,
    data
  );

  return response.data;
};

export const updateStoreOrderProduct = async (
  data: Partial<OrderProduct>,
  storeId: string | number,
  orderId: string | number,
  productId: string | number
) => {
  const response = await apiClient.put<OrderProduct>(
    `/store/${storeId}/order/${orderId}/product/${productId}`,
    data
  );

  return response.data;
};
