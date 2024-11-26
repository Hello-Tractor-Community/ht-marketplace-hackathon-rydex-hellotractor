import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import SubCategory from "./SubCategory";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: true,
  tableName: "categories",
})
class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon?: string;

  @HasMany(() => SubCategory)
  subCategories!: SubCategory[];
}

export default Category;
