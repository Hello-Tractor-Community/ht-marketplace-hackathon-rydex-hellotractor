import { Table, Column, Model } from "sequelize-typescript";
import { DataTypes, InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  timestamps: false,
  tableName: "dealer_types",
})
class DealerType extends Model<
  InferAttributes<DealerType>,
  InferCreationAttributes<DealerType>
> {
  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  name!: string;
}

export default DealerType;
