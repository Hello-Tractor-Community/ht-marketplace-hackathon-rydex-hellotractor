import apiClient, { Buyer } from "../../utils/apiClient";
import { InventoryRecord } from "../product/createStockRecord";
import { Product, Review } from "../product/getProducts";
import { Store } from "../stores/getStores";

export type PlaceOrderPayload = {
  storeId: number;
  data?: {
    specialInstructions?: string;
  };
  orderProducts: {
    productId: number;
    quantity: number;
  }[];
};

export type OrderProduct = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  pricePerUnit: number | null;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  productInventoryId?: number;
  productInventory?: InventoryRecord;
};

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type Order = {
  id: number;
  buyerId: number;
  storeId: number;
  status: OrderStatus;
  data?: {
    specialInstructions: string;
  };
  priceTotal?: number;
  createdAt: string;
  updatedAt: string;
  orderProducts: OrderProduct[];
  buyer?: Buyer;
  OrderProduct?: OrderProduct;
  store?: Store;
  productReviews?: Review[];
};

export const placeOrder = async (order: PlaceOrderPayload) => {
  const response = await apiClient.post<Order>("/buyer/order", order);

  return response.data;
};
