import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Chat } from "./Chat";
import { User } from "./User";

@Table({
  timestamps: true,
  tableName: "chat_users",
})
export class ChatUser extends Model<
  InferAttributes<ChatUser>,
  InferCreationAttributes<ChatUser>
> {
  @ForeignKey(() => Chat)
  @Column({
    type: DataType.INTEGER,
  })
  chatId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  messagesRead!: number;

  @BelongsTo(() => Chat)
  chat!: Chat;
}
