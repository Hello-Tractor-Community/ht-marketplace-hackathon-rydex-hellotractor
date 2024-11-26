import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
  ForeignKey,
  BelongsTo,
  DefaultScope,
} from "sequelize-typescript";
import SubCategory from "./SubCategory";
import SubCategoryProduct from "./SubCategoryProduct";
import { Store } from "./Store";
import { ProductInventory } from "./ProductInventory";
import { Order } from "./Order";
import { OrderProduct } from "./OrderProduct";
import { ProductReview } from "./ProductReview";

export type ProductListingStatus =
  | "ACTIVE"
  | "PAUSED"
  | "SOLD_OUT"
  | "PENDING_APPROVAL";
export type ProductCondition =
  | "NEW"
  | "USED_FAIR"
  | "USED_GOOD"
  | "USED_EXCELLENT";

export type ProductSpecs = {
  [key: string]: string;
};

export type FileItem = {
  id: string;
  uploadedOn: Date;
  url: string;
  mimeType?: string;
};

@DefaultScope(() => ({
  attributes: {
    exclude: ["views", "clicks", "trackInventory", "stockCount"],
  },
}))
@Table({
  timestamps: true,
  tableName: "products",
})
class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  @Column({
    type: DataType.JSONB,
  })
  photos!: FileItem[];

  @Column({
    type: DataType.JSONB,
  })
  thumbnail?: FileItem;

  @Column({
    type: DataType.JSONB,
  })
  specifications!: ProductSpecs;

  @Column({
    type: DataType.STRING,
  })
  name!: string;

  @Column({
    type: DataType.ENUM("ACTIVE", "PAUSED", "SOLD_OUT", "PENDING_APPROVAL"),
    defaultValue: "PENDING_APPROVAL",
  })
  status!: ProductListingStatus;

  @Column({
    type: DataType.ENUM("NEW", "USED_FAIR", "USED_GOOD", "USED_EXCELLENT"),
    defaultValue: "USED_GOOD",
  })
  condition!: ProductCondition;

  @Column({
    type: DataType.FLOAT,
  })
  price!: number;

  @Column({
    type: DataType.JSONB,
  })
  location!: { latlng: string; address: string };

  @Column({
    type: DataType.JSONB,
  })
  history!: { date: Date; event: string }[];
  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  clicks!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  views!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  trackInventory!: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  stockCount!: number;

  @BelongsToMany(() => SubCategory, () => SubCategoryProduct)
  subCategories!: SubCategory[];

  @HasMany(() => SubCategoryProduct)
  subCategoryProducts!: SubCategoryProduct[];

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
  })
  storeId!: number;

  @BelongsTo(() => Store)
  store!: Store;

  @HasMany(() => ProductInventory)
  inventory!: ProductInventory[];

  @BelongsToMany(() => Order, () => OrderProduct)
  orders!: Order[];

  @HasMany(() => OrderProduct)
  orderProducts!: OrderProduct[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  reviewCount!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  rating!: number;

  @HasMany(() => ProductReview)
  productReviews!: ProductReview[];
}

export default Product;
