import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";

export type AdminData = {};

@Table({
  timestamps: true,
  tableName: "admins",
})
export class Admin extends Model<
  InferAttributes<Admin>,
  InferCreationAttributes<Admin>
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: CreationOptional<User>;

  @Column({
    type: DataType.JSONB,
  })
  data?: AdminData;
}
