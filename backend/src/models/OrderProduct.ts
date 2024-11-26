import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  AfterCreate,
  AfterUpdate,
  AfterDestroy,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Order } from "./Order";
import Product from "./Product";
import { Op } from "sequelize";
import { ProductInventory } from "./ProductInventory";

@Table({
  timestamps: true,
  tableName: "order_products",
})
export class OrderProduct extends Model<
  InferAttributes<OrderProduct>,
  InferCreationAttributes<OrderProduct>
> {
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  pricePerUnit?: number | null;

  @BelongsTo(() => ProductInventory)
  productInventory?: ProductInventory;

  @ForeignKey(() => ProductInventory)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productInventoryId?: number | null;

  @AfterCreate
  @AfterUpdate
  @AfterDestroy
  static async updateOrderTotal(instance: OrderProduct) {
    const orderId = instance.orderId;
    const orderProducts = await OrderProduct.findAll({
      where: { orderId, pricePerUnit: { [Op.ne]: null } },
    });
    const priceTotal = orderProducts.reduce(
      (sum, product) => sum + product.pricePerUnit! * product.quantity,
      0
    );
    await Order.update({ priceTotal }, { where: { id: orderId } });
  }
}
