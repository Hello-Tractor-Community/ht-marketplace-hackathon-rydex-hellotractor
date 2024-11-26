import apiClient from "../../utils/apiClient";
import { Product } from "./getProducts";

export const createProduct = async (
  data: Product,
  storeId: string | number
) => {
  const response = await apiClient.post<Product>(`/store/${storeId}/product`, {
    ...data,
  });

  return response.data;
};
