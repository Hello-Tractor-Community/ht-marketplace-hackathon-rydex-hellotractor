import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Seller } from "./Seller";
import { Store } from "./Store";

@Table({
  timestamps: false,
  tableName: "seller_stores",
})
export class SellerStore extends Model {
  @ForeignKey(() => Seller)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sellerId!: number;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  storeId!: number;
}
