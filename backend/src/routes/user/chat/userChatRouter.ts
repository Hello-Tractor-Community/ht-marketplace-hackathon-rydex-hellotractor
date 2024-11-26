import { Request, Router } from "express";
import { Chat } from "../../../models/Chat";
import { ChatUser } from "../../../models/ChatUser";
import { InferCreationAttributes, Op } from "sequelize";
import { User } from "../../../models/User";
import { ChatMessage } from "../../../models/ChatMessage";
import { ReadReceipt } from "../../../models/ReadReceipt";
import { ApiError } from "../../../utils/errors";
import { extendedParser } from "../../../utils/queryParser";

const userChatRouter = Router();

userChatRouter.get("/", async (req: Request, res, next) => {
  try {
    const parsed = extendedParser(req);
    const chats = await Chat.findAll({
      ...parsed.data,
      include: [
        {
          model: ChatUser,
          where: {
            userId: req.user?.id,
          },
        },
        {
          model: User,
          where: {
            id: {
              [Op.ne]: req.user?.id,
            },
          },
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

    res.json(chats);
  } catch (error) {
    next(error);
  }
});

userChatRouter.get("/:chatId", async (req: Request, res, next) => {
  try {
    const chat = await Chat.findOne({
      where: {
        id: req.params.chatId,
      },
      include: [
        {
          model: ChatUser,
          where: {
            userId: req.user?.id,
          },
        },
        {
          model: User,
          where: {
            id: {
              [Op.ne]: req.user?.id,
            },
          },
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

    res.json(chat);
  } catch (error) {
    next(error);
  }
});

userChatRouter.get("/:chatId/messages", async (req: Request, res, next) => {
  try {
    const chat = await Chat.findOne({
      where: {
        id: req.params.chatId,
      },
      include: [
        {
          model: ChatUser,
          where: {
            userId: req.user?.id,
          },
        },
      ],
    });

    if (!chat) {
      throw new ApiError(404, "Chat not found");
    }

    const parsed = extendedParser(req);

    const chatMessageQuery = {
      ...parsed.data,
      include: [
        {
          model: ReadReceipt,
        },
        {
          model: User,
        },
      ],
    };

    let messages = await chat.$get("messages", chatMessageQuery);

    const readReceiptsToCreate: InferCreationAttributes<ReadReceipt>[] = [];

    messages.forEach((message) => {
      if (!message.readReceipts?.find((rr) => rr.userId === req.user?.id)) {
        readReceiptsToCreate.push({
          userId: req.user?.id!,
          chatMessageId: message.id,
        });
      }
    });

    if (readReceiptsToCreate.length > 0) {
      await ReadReceipt.bulkCreate(readReceiptsToCreate);
    }

    res.json(messages);
  } catch (error) {
    next(error);
  }
});

export default userChatRouter;
