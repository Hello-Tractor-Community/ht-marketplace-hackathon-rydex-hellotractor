import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterBulkCreate,
  AfterUpdate,
  AfterCreate,
  AfterBulkUpdate,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { User } from "./User";
import { ChatMessage } from "./ChatMessage";
import { ChatUser } from "./ChatUser";
import { Chat } from "./Chat";

@Table({
  timestamps: true,
  tableName: "read_receipts",
})
export class ReadReceipt extends Model<
  InferAttributes<ReadReceipt>,
  InferCreationAttributes<ReadReceipt>
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => ChatMessage)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  chatMessageId!: number;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => ChatMessage)
  chatMessage?: ChatMessage;

  @AfterBulkCreate
  @AfterCreate
  static async updateChatCount(instances: ReadReceipt[] | ReadReceipt) {
    console.log("\n\n\nupdateChatCount hook", instances);

    const receipt = Array.isArray(instances) ? instances[0] : instances;

    const chatMessage = await ChatMessage.findOne({
      where: {
        id: receipt.chatMessageId,
      },
    });
    if (!chatMessage) {
      console.log(
        "Chat message not found in read receipt hook",
        receipt.toJSON()
      );
      return;
    }
    const chatUser = await ChatUser.findOne({
      where: {
        chatId: chatMessage.chatId,
        userId: receipt.userId,
      },
    });

    const chat = await Chat.findOne({
      where: {
        id: chatMessage.chatId,
      },
    });

    if (!chatUser || !chat) {
      console.log(
        "Chat user or chat not found in read receipt hook",
        receipt.toJSON(),
        chatMessage.toJSON()
      );
      return;
    }

    chatUser.messagesRead = chat.totalMessages ?? 0;

    await chatUser.save();

    console.log("chatUser updated", chatUser.toJSON());
  }
}
