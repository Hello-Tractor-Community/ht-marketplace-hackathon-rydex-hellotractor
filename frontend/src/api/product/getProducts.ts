import { ProductCondition } from "../../components/Products/filterCard";
import apiClient from "../../utils/apiClient";
import { FileItem } from "../../utils/uploadFile";
import { Order } from "../order/placeOrder";
import { InventoryRecord } from "./createStockRecord";
import { SubCategory } from "./getSearchOptions";

export type ProductListingStatus =
  | "ACTIVE"
  | "PAUSED"
  | "SOLD_OUT"
  | "PENDING_APPROVAL";

export type Review = {
  id: number;
  productId: number;
  orderId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  order?: Order;
};

export const humanFriendlyCondition = (condition: ProductCondition) => {
  switch (condition) {
    case "NEW":
      return "New";
    case "USED_EXCELLENT":
      return "Used - Excellent";
    case "USED_GOOD":
      return "Used - Good";

    case "USED_FAIR":
      return "Used - Fair";
    default:
      return condition;
  }
};

export interface Product {
  id: number;
  photos: FileItem[];
  thumbnail: FileItem;
  specifications: {
    [key: string]: string | number;
  };
  name: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  location: { latlng: string; address: string };
  history: { date: Date; event: string }[];
  status: ProductListingStatus;
  storeId: number;
  description: string;
  orders?: Order[];
  stockCount?: number;
  clicks?: number;
  views?: number;
  trackInventory?: boolean;
  inventory?: InventoryRecord[];
  condition: ProductCondition;
  subCategories?: SubCategory[];
  rating?: number;
  reviewCount?: number;
  productReviews?: Review[];
}

export const getProducts = async (params?: object) => {
  const response = await apiClient.get<{
    products: Product[];
    total: number;
    highestPrice?: number;
    lowestPrice?: number;
  }>("/product", {
    params: {
      ...params,
    },
  });

  return response.data;
};

export const getProduct = async (productId: number | string) => {
  const response = await apiClient.get<Product>(`/product/${productId}`);
  return response.data;
};

export const getCategoryProducts = async (
  categoryId: number | string,
  params?: object
) => {
  const response = await apiClient.get<{
    products: Product[];
    total: number;
    highestPrice?: number;
    lowestPrice?: number;
  }>(`/category/${categoryId}/product`, {
    params: {
      ...params,
    },
  });

  return response.data;
};

export const getSubCategoryProducts = async (
  subCategoryId: number | string,
  params?: object
) => {
  const response = await apiClient.get<{
    products: Product[];
    total: number;
    highestPrice?: number;
    lowestPrice?: number;
  }>(`/category/subCategory/${subCategoryId}/product`, {
    params: {
      ...params,
    },
  });

  return response.data;
};

export const getMyProducts = async (
  storeId: number | string,
  params?: object
) => {
  const response = await apiClient.get<Product[]>(`/store/${storeId}/product`, {
    params: {
      ...params,
    },
  });

  return response.data;
};

export const getMyProduct = async (
  storeId: number | string,
  productId: number | string,
  params?: object
) => {
  console.log("getting product in storeId", storeId);
  const response = await apiClient.get<Product>(
    `/store/${storeId}/product/${productId}`,
    { params }
  );

  return response.data;
};
