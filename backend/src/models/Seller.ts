import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import { User } from "./User";
import { ApiError } from "../utils/errors";
import { verify } from "jsonwebtoken";
import { Store } from "./Store";
import { SellerStore } from "./SellerStore"; // Import the junction table model

export type SellerData = {};

export type SellerAttributes = InferAttributes<Seller>;
export type SellerCreationAttributes = InferCreationAttributes<Seller>;

@Table({
  timestamps: true,
  tableName: "sellers",
})
export class Seller extends Model<
  InferAttributes<Seller>,
  InferCreationAttributes<Seller>
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @Column({
    type: DataType.JSONB,
  })
  data?: SellerData;

  @BelongsTo(() => User)
  user!: User;

  @BelongsToMany(() => Store, () => SellerStore)
  stores!: Store[];

  async createToken(data?: any) {
    const user = await this.$get("user");

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    return user.createToken({ sellerId: this.id, ...data });
  }

  static getFromToken(token: string) {
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: number;
      data: {
        sellerId: number;
      };
    };

    return Seller.findOne({
      where: {
        id: decoded.data.sellerId,
      },
      include: [User],
    });
  }
}
