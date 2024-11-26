import apiClient, { User } from "../../utils/apiClient";
import { FileItem } from "../../utils/uploadFile";

export type ChatUser = {
  chatId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  messagesRead: number;
};

export type Message = {
  id: number;
  userId: number;
  chatId: number;
  message: string;
  attachments?: FileItem[];
  createdAt: string;
  updatedAt: string;
  readReceipts?: ReadReceipt[];
  user?: User;

  // This is only used in the frontend, used to track delivery status of the message
  tempId?: string;
};

export type Chat = {
  id: number;
  head: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  chatUsers: ChatUser[];
  headMessage: Message;
  messages?: Message[];
  users?: User[];
  totalMessages: number;
};

export type ReadReceipt = {
  id: number;
  chatMessageId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  chatMessage?: Message;
};

export const getChats = async (): Promise<Chat[]> => {
  const response = await apiClient.get<Chat[]>("/user/chat");
  return response.data;
};

export const getChatMessages = async (
  chatId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any
): Promise<Message[]> => {
  const response = await apiClient.get<Message[]>(
    `/user/chat/${chatId}/messages`,
    { params }
  );
  return response.data;
};

export const initiateChat = async (
  storeId: number | string,
  message: string
) => {
  const response = await apiClient.post<Chat>("/buyer/chat", {
    storeId,
    message,
  });
  return response.data;
};
