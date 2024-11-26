import apiClient from "../../utils/apiClient";
import { FileItem } from "../../utils/uploadFile";

export type StoreService = {
  title: string;
  description: string;
};
export type StoreData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coverImage?: FileItem;
  services: StoreService[];
  businessHours: {
    day: string;
    hours: string;
  }[];
};
export type StoreType = "STORE" | "DEALER" | "SERVICE_CENTER";

export type Location = {
  latlng: string;
  address: string;
  region?: string;
};

export type Store = {
  id: number;
  name: string;
  description?: string;
  location?: Location;
  phone?: string;
  email?: string;
  website?: string;
  data?: StoreData;
  logo?: FileItem;
  sellers?: number[]; // Assuming you will use seller IDs
  productListings?: number[]; // Assuming you will use product listing IDs
  createdAt: string;
  updatedAt: string;
  type: "STORE" | "DEALER" | "SERVICE_CENTER";
  dealerType?: string;
  rating?: number;
  reviewCount?: number;
};

export const getMyStores = async () => {
  const response = await apiClient.get<Store[]>(`/seller/store`);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStores = async (params?: any) => {
  const response = await apiClient.get<{
    stores: Store[];
    total: number;
  }>("/store", { params });

  return response.data;
};

export const getStore = async (id: number | string) => {
  const response = await apiClient.get<Store>(`/store/${id}`);

  return response.data;
};

export type Region = {
  name: string;
};

export const getRegions = async () => {
  const response = await apiClient.get<Region[]>("/misc/regions");
  return response.data.map((region) => region.name);
};

export const getDealerTypes = async () => {
  const response = await apiClient.get<Region[]>("/misc/dealerTypes");
  return response.data.map((dealerType) => dealerType.name);
};
