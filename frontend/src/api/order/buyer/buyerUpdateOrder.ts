import apiClient from "../../../utils/apiClient";
import { Order } from "../placeOrder";

export const buyerUpdateOrder = async (
  orderId: string | number,
  data: Partial<Order>
) => {
  const response = await apiClient.put<Order>(`/buyer/order/${orderId}`, data);
  return response.data;
};
