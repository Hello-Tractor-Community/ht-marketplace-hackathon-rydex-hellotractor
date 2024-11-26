import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  DefaultScope,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { sign, verify } from "jsonwebtoken";
import { compareSync, hashSync } from "bcrypt";
import { Seller } from "./Seller";
import { Buyer } from "./Buyer";
import { Chat } from "./Chat";
import { ChatUser } from "./ChatUser";
import { ChatMessage } from "./ChatMessage";
import { ReadReceipt } from "./ReadReceipt";
import { Admin } from "./Admin";

export type UserData = {};

export type UserTokenPayload = {
  id: number;
  data: {
    sellerId?: number;
    buyerId?: number;
    adminId?: number;
  };
};

export type UserAttributes = InferAttributes<User>;

@DefaultScope(() => ({
  attributes: {
    exclude: ["password"],
  },
}))
@Table({
  timestamps: true,
  tableName: "users",
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email?: string;

  @Column({
    type: DataType.STRING,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  phone?: string;

  @Column({
    type: DataType.JSONB,
  })
  data?: UserData;

  @Column({
    type: DataType.STRING,
  })
  image?: string;

  @HasMany(() => Seller)
  sellers?: Seller[];

  @HasMany(() => Buyer)
  buyers?: Buyer[];

  @HasMany(() => Admin)
  admins?: Admin[];

  @HasMany(() => ChatUser)
  chatUsers?: ChatUser[];

  @BelongsToMany(() => Chat, () => ChatUser)
  chats?: Chat[];

  @HasMany(() => ChatMessage)
  chatMessages?: ChatMessage[];

  @HasMany(() => ReadReceipt)
  readReceipts?: ReadReceipt[];

  static async createFromEmailAndPassword(
    email: string,
    password: string,
    name: string
  ) {
    return User.create({
      email,
      password: hashSync(password, 10),
      name,
    });
  }

  static async validatePassword(email: string, password: string) {
    const user = await User.findOne({
      where: { email },
      attributes: {
        include: ["password"],
      },
      include: [Seller, Buyer, Admin],
    });

    if (!user) {
      return null;
    }

    if (compareSync(password, user.password)) {
      return user;
    }

    return null;
  }

  createToken(data?: UserTokenPayload["data"]) {
    const userToken: UserTokenPayload = {
      id: this.id,
      data: data || {
        sellerId: this.sellers?.[0]?.id,
        buyerId: this.buyers?.[0]?.id,
        adminId: this.admins?.[0]?.id,
      },
    };
    return sign(userToken, process.env.JWT_SECRET!);
  }

  static getFromToken(token: string) {
    const decoded = verify(token, process.env.JWT_SECRET!) as UserTokenPayload;
    return User.findByPk(decoded.id);
  }
}
