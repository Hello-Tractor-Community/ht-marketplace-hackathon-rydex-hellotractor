import apiClient from "../../utils/apiClient";
import { Product } from "./getProducts";

export const updateProduct = async (
  data: Partial<Product>,
  productId: string | number,
  storeId: string | number
) => {
  const response = await apiClient.put<Product>(
    `/store/${storeId}/product/${productId}`,
    data
  );

  return response.data;
};

export const adminUpdateProduct = async (
  data: Partial<Product>,
  productId: string | number
) => {
  const response = await apiClient.put<Product>(
    `/admin/product/${productId}`,
    data
  );

  return response.data;
};
