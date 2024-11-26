import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import SubCategory from "./SubCategory";
import Product from "./Product";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: false,
  tableName: "sub_category_products",
})
class SubCategoryProduct extends Model<
  InferAttributes<SubCategoryProduct>,
  InferCreationAttributes<SubCategoryProduct>
> {
  @ForeignKey(() => SubCategory)
  @Column
  subCategoryId!: number;

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => SubCategory)
  subCategory!: SubCategory;

  @BelongsTo(() => Product)
  product!: Product;
}

export default SubCategoryProduct;
