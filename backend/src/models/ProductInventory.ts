import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  HasMany,
} from "sequelize-typescript";
import Product from "./Product";
import { OrderProduct } from "./OrderProduct";
import { Order } from "./Order";

@Table({
  timestamps: true,
  tableName: "product_inventories",
})
export class ProductInventory extends Model {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amountIn!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amountOut!: number;

  @HasMany(() => OrderProduct)
  orderProduct?: OrderProduct;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderId?: number | null;

  @BelongsTo(() => Order)
  order?: Order;

  @BelongsTo(() => Product)
  product!: Product;

  @BeforeCreate
  static async updateStockCount(instance: ProductInventory) {
    console.log("hook me and update stock count");
    const product = await Product.findByPk(instance.productId, {
      attributes: {
        include: ["trackInventory", "stockCount"],
      },
    });
    if (product && product.trackInventory) {
      console.log("updating stock count");
      product.stockCount += instance.amountIn - instance.amountOut;

      if (product.stockCount <= 0) {
        product.status = "SOLD_OUT";
      }

      await product.save();
    } else {
      console.log("not updating stock count", product?.toJSON());
    }
  }
}
