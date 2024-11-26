import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Buyer } from "./Buyer";
import { Store } from "./Store";
import { OrderProduct } from "./OrderProduct";
import Product from "./Product";
import { ProductInventory } from "./ProductInventory";
import { ProductReview } from "./ProductReview";

export type OrderData = {};

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

@Table({
  timestamps: true,
  tableName: "orders",
})
export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  @ForeignKey(() => Buyer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  buyerId!: number;

  @BelongsTo(() => Buyer)
  buyer!: Buyer;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  storeId!: number;

  @BelongsTo(() => Store)
  store!: Store;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: "PENDING",
  })
  status!: OrderStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  data?: OrderData;

  @Column({
    type: DataType.FLOAT,
  })
  priceTotal?: number;

  @BelongsToMany(() => Product, () => OrderProduct)
  products!: Product[];

  @HasMany(() => OrderProduct)
  orderProducts!: OrderProduct[];

  @HasMany(() => ProductInventory)
  productInventories?: ProductInventory[];

  @HasMany(() => ProductReview)
  productReviews!: ProductReview[];
}
