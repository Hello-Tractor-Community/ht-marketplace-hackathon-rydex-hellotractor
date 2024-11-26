import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import Category from "./Category";
import Product from "./Product";
import SubCategoryProduct from "./SubCategoryProduct";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: true,
  tableName: "sub_categories",
})
class SubCategory extends Model<
  InferAttributes<SubCategory>,
  InferCreationAttributes<SubCategory>
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @BelongsToMany(() => Product, () => SubCategoryProduct)
  products!: Product[];

  @Column({
    type: DataType.JSONB,
  })
  specificationSchema?: object;

  @Column({
    type: DataType.JSONB,
  })
  filterSchema?: object;
}

export default SubCategory;
