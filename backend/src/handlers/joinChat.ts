import { Server, Socket } from "socket.io";
import { Callback } from ".";
import { Chat } from "../models/Chat";
import { ChatUser } from "../models/ChatUser";

export type JoinChatPayload = {
  chatId: number;
};
const joinChat = (io: Server, socket: Socket) => {
  return async ({ chatId }: JoinChatPayload, callback: Callback) => {
    try {
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
      } else {
        await chat.reload({
          include: [
            {
              model: ChatUser,
            },
          ],
        });

        socket
          .to(
            chat.chatUsers?.map((c) => c.userId?.toString()).filter(Boolean) ??
              []
          )
          .emit("chat:joined", {
            chatId,
            userId: socket.data.id,
          });
        callback?.({
          success: true,
          data: chat.toJSON(),
        });
      }
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

// export const leaveChat = (io: Server, socket: Socket) => {
//   return async ({ chatId }: JoinChatPayload, callback: Callback) => {
//     try {
//       const chat = await Chat.findOne({
//         where: {
//           id: chatId,
//         },
//         include: [
//           {
//             model: ChatUser,
//             where: {
//               userId: socket.data.id,
//             },
//           },
//         ],
//       });

//       if (!chat) {
//         return callback?.({
//           success: false,
//           data: null,
//           message: "Chat not found",
//         });
//       } else {
//         socket.leave(chatId.toString());
//         callback?.({
//           success: true,
//           data: chat,
//         });
//       }
//     } catch (error: any) {
//       console.log(error);
//       callback?.({
//         success: false,
//         data: null,
//         message: error?.message ?? "An error occurred",
//       });
//     }
//   };
// };

export default joinChat;
