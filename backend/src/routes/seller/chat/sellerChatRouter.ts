import { Router, Request } from "express";
import { Chat } from "../../../models/Chat";
import { ChatUser } from "../../../models/ChatUser";
import { ChatMessage } from "../../../models/ChatMessage";
import { User } from "../../../models/User";
import { ApiError } from "../../../utils/errors";
import { ReadReceipt } from "../../../models/ReadReceipt";
import { io } from "../../..";

const sellerChatRouter = Router();

sellerChatRouter.post("/", async (req: Request, res, next) => {
  try {
    const { buyerId, message } = req.body;

    const buyer = await User.findByPk(buyerId);

    if (!buyer) {
      throw new ApiError(404, "Buyer not found");
    }

    let chat: Chat | null = null;

    let existingChatUser = await ChatUser.findOne({
      where: {
        userId: req.user?.id,
      },
      include: [
        {
          model: Chat,
          include: [
            {
              model: ChatUser,
              where: {
                userId: buyer.id,
              },
            },
          ],
        },
      ],
    });

    if (existingChatUser) {
      chat = existingChatUser.chat;

      const newMessage = await ChatMessage.create({
        chatId: chat.id,
        userId: req.user?.id!,
        message: message,
      });

      chat.head = newMessage.id;

      await chat.save();

      await ReadReceipt.create({
        userId: req.user?.id!,
        chatMessageId: newMessage.id,
      });
    } else {
      chat = await Chat.create(
        {
          chatUsers: [
            {
              userId: req.user?.id!,
            },
            {
              userId: buyer.id,
            },
          ] as any,
          type: "single",
          messages: [
            {
              userId: req.user?.id!,
              message: message,
            },
          ] as any,
        },
        {
          include: [
            ChatUser,
            {
              model: ChatMessage,
              as: "messages",
            },
          ],
        }
      );

      chat.head = chat.messages?.[0].id;

      await chat.save();

      await ReadReceipt.create({
        userId: req.user?.id!,
        chatMessageId: chat.messages?.[0].id,
      });
    }

    await chat.reload({
      include: [
        {
          model: ChatUser,
        },
        {
          model: User,
        },
        {
          model: ChatMessage,
          as: "headMessage",
          include: [
            {
              model: ReadReceipt,
            },
            {
              model: User,
            },
          ],
        },
      ],
    });

    if (!existingChatUser) {
      io.to(buyer.id.toString()).emit("chat:created", chat);
    } else {
      io.to(buyer.id.toString()).emit("chat:message", chat.headMessage);
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
});

export default sellerChatRouter;
