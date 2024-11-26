import { Request, Router } from "express";
import { Chat } from "../../../models/Chat";
import { ChatUser } from "../../../models/ChatUser";
import { ChatMessage } from "../../../models/ChatMessage";
import { Seller } from "../../../models/Seller";
import { User } from "../../../models/User";
import { Store } from "../../../models/Store";
import { ApiError } from "../../../utils/errors";
import { ReadReceipt } from "../../../models/ReadReceipt";
import { io } from "../../..";

const buyerChatRouter = Router();

//This endpoint is specifically for a buyer to initiate a chat with a store owner
buyerChatRouter.post("/", async (req: Request, res, next) => {
  try {
    // const { userId } = req.body;
    const { storeId, message } = req.body;

    const storeOwner = await User.findOne({
      include: [
        {
          model: Seller,
          include: [
            {
              model: Store,
              where: { id: storeId },
            },
          ],
        },
      ],
    });

    if (!storeOwner) {
      throw new ApiError(404, "Store not found");
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
                userId: storeOwner?.id,
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
              userId: storeOwner?.id!,
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

      console.log("chat created", JSON.stringify(chat.toJSON(), null, 2));

      chat.head = chat.messages?.[0].id;

      await chat.save();

      await ReadReceipt.create({
        userId: req.user?.id!,
        chatMessageId: chat.messages?.[0].id,
      });
    }

    //making sure its the same format as the other endpoint
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
      io.to(storeOwner.id.toString()).emit("chat:created", chat);
    } else {
      io.to(storeOwner.id.toString()).emit("chat:message", chat.headMessage);
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
});

export default buyerChatRouter;
