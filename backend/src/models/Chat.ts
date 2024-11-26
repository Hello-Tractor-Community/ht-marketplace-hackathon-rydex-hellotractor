import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  DefaultScope,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { ChatMessage } from "./ChatMessage";
import { User } from "./User";
import { ChatUser } from "./ChatUser";

@Table({
  timestamps: true,
  tableName: "chats",
})
export class Chat extends Model<
  InferAttributes<Chat>,
  InferCreationAttributes<Chat>
> {
  @ForeignKey(() => ChatMessage)
  @Column({
    type: DataType.INTEGER,
  })
  head?: number;

  @Column({
    type: DataType.ENUM("group", "single"),
  })
  type!: string;

  @BelongsTo(() => ChatMessage, { foreignKey: "head" })
  headMessage?: ChatMessage;

  @HasMany(() => ChatMessage)
  messages?: ChatMessage[];

  @HasMany(() => ChatUser)
  chatUsers?: ChatUser[];

  @BelongsToMany(() => User, () => ChatUser)
  users?: User[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalMessages?: number;
}
