import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  AfterCreate,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Chat } from "./Chat";
import { User } from "./User";
import { FileItem } from "./Product";
import { ReadReceipt } from "./ReadReceipt";

@Table({
  timestamps: true,
  tableName: "chat_messages",
})
export class ChatMessage extends Model<
  InferAttributes<ChatMessage>,
  InferCreationAttributes<ChatMessage>
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @ForeignKey(() => Chat)
  @Column({
    type: DataType.INTEGER,
  })
  chatId!: number;

  @Column({
    type: DataType.TEXT,
  })
  message!: string;

  @Column({
    type: DataType.JSONB,
  })
  attachments?: FileItem[];

  @BelongsTo(() => User, { foreignKey: "userId" })
  user?: User;

  @BelongsTo(() => Chat, { foreignKey: "chatId" })
  chat?: Chat;

  @HasMany(() => ReadReceipt)
  readReceipts?: ReadReceipt[];

  @AfterCreate
  static async updateChatCount(instance: ChatMessage) {
    let chat = instance.chat ?? null;
    if (!chat) {
      chat = await Chat.findByPk(instance.chatId);
    }
    if (!chat) {
      return;
    }
    await chat?.increment("totalMessages");
  }
}
