import { Server, Socket } from "socket.io";
import { Callback } from ".";
import { Chat } from "../models/Chat";
import { ChatUser } from "../models/ChatUser";
import { ReadReceipt } from "../models/ReadReceipt";
import { ChatMessage } from "../models/ChatMessage";

export type ChatMessagePayload = {
  chatId: number;
  messageId: number;
};
const chatRead = (io: Server, socket: Socket) => {
  return async (
    { chatId, messageId }: ChatMessagePayload,
    callback: Callback
  ) => {
    try {
      console.log("\n\n\nchat:read", chatId, messageId, socket.data);
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
          {
            model: ChatMessage,
            as: "messages",
            where: {
              id: messageId,
            },
          },
        ],
      });

      if (!chat) {
        console.log("Chat not found");
        return callback?.({
          success: false,
          data: null,
          message: "Chat not found",
        });
      }

      await chat.reload({
        include: [
          {
            model: ChatUser,
          },
        ],
      });

      const receipt = await ReadReceipt.create({
        chatMessageId: messageId,
        userId: socket.data.id,
      });

      socket
        .to(
          chat.chatUsers?.map((c) => c.userId?.toString()).filter(Boolean) ?? []
        )
        .emit("chat:read", receipt.toJSON());

      callback?.({
        success: true,
        data: receipt.toJSON(),
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

export default chatRead;
