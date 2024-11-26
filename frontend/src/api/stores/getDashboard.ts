import apiClient from "../../utils/apiClient";

export type DashboardData = {
  orders: {
    date: string;
    priceTotal: number;
    count: number;
  }[];
};

export type GetDashboardParams = {
  from: string;
  to: string;
};
export const getDashboard = async (
  storeId: string | number,
  params: GetDashboardParams
) => {
  const response = await apiClient.get(`/store/${storeId}/dashboard`, {
    params,
  });

  return response.data;
};

export const getAdminDashboard = async (params: GetDashboardParams) => {
  const response = await apiClient.get(`/admin/dashboard`, {
    params,
  });

  return response.data;
};
