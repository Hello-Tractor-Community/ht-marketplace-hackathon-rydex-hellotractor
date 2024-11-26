import { Table, Column, Model } from "sequelize-typescript";
import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: false,
  tableName: "regions",
})
class Region extends Model<
  InferAttributes<Region>,
  InferCreationAttributes<Region>
> {
  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  name!: string;
}

export default Region;
