import apiClient from "../../utils/apiClient";

interface CreateChatParams {
  buyerId: number;
  message: string;
}

export const createChat = async (params: CreateChatParams) => {
  const response = await apiClient.post("/seller/chat", params);
  return response.data;
};
