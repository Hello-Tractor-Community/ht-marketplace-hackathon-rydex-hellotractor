import { Server, Socket } from "socket.io";
import { FileItem } from "../models/Product";
import { Callback } from ".";
import { Chat } from "../models/Chat";
import { ChatUser } from "../models/ChatUser";
import { ReadReceipt } from "../models/ReadReceipt";

export type ChatMessagePayload = {
  chatId: number;
  message: string;
  attachments?: FileItem[];
  tempId?: string;
};
const chatMessage = (io: Server, socket: Socket) => {
  return async (
    { chatId, message, attachments, tempId }: ChatMessagePayload,
    callback: Callback
  ) => {
    try {
      console.log("chat:message", chatId, message, attachments, socket.data);
      const chat = await Chat.findOne({
        where: {
          id: chatId,
        },
        include: [
          {
            model: ChatUser,
            where: {
              userId: socket.data.id,
            },
          },
        ],
      });

      if (!chat) {
        return callback?.({
          success: false,
          data: null,
          message: "Chat not found",
        });
      }

      const chatMessage = await chat.$create("message", {
        userId: socket.data.id,
        message,
        attachments,
      });

      chat.head = chatMessage.id;
      await chat.save();

      await chat.reload({
        include: [
          {
            model: ChatUser,
          },
        ],
      });

      await ReadReceipt.create({
        chatMessageId: chatMessage.id,
        userId: socket.data.id,
      });

      socket
        .to(
          chat.chatUsers?.map((c) => c.userId?.toString()).filter(Boolean) ?? []
        )
        .emit("chat:message", chatMessage);

      callback?.({
        success: true,
        data: { ...chatMessage?.toJSON(), tempId },
      });
    } catch (error: any) {
      console.log(error);
      callback?.({
        success: false,
        data: null,
        message: error?.message ?? "An error occurred",
      });
    }
  };
};

export default chatMessage;
