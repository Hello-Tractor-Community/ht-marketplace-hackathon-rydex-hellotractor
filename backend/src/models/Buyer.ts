import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { User } from "./User";
import { Order } from "./Order";

export type BuyerCreationAttributes = InferCreationAttributes<Buyer>;

export type BuyerData = {};

@Table({
  timestamps: true,
  tableName: "buyers",
})
export class Buyer extends Model<
  InferAttributes<Buyer>,
  InferCreationAttributes<Buyer>
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Order)
  orders!: Order[];

  @Column({
    type: DataType.JSONB,
  })
  data?: BuyerData;
}
