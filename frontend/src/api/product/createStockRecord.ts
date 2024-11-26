import apiClient from "../../utils/apiClient";

export type InventoryRecord = {
  id: number;
  productId: number;
  amountIn: number;
  amountOut: number;
  createdAt: string;
  updatedAt: string;
};
export const createStockRecord = async (
  storeId: string | number,
  productId: string | number,
  params: CreateStockParams[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await apiClient.post<any>(
    `/store/${storeId}/product/${productId}/inventory`,
    params
  );

  return response.data;
};

export type CreateStockParams = {
  amountIn: number;
  amountOut: number;
  orderId?: number;
};
