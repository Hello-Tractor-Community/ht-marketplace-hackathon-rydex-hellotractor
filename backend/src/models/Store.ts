import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { Seller } from "./Seller"; // Adjust the import path as necessary
import { SellerStore } from "./SellerStore"; // Import the junction table model
import { Location } from "../utils/location";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import Product, { FileItem } from "./Product";
import { Order } from "./Order";

export type StoreData = {
  [key: string]: string;
};

export type StoreType = "STORE" | "DEALER" | "SERVICE_CENTER";

@Table({
  timestamps: true,
  tableName: "stores",
})
export class Store extends Model<
  InferAttributes<Store>,
  InferCreationAttributes<Store>
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  location!: Location;

  @Column({
    type: DataType.ENUM("STORE", "DEALER", "SERVICE_CENTER"),
    allowNull: false,
    defaultValue: "STORE",
  })
  type!: StoreType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  region?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  dealerType?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  logo?: FileItem;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  data?: StoreData;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  rating!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  reviewCount!: number;

  @BelongsToMany(() => Seller, () => SellerStore)
  sellers!: Seller[];

  @HasMany(() => Product)
  products!: Product[];

  @HasMany(() => Order)
  orders!: Order[];
}
