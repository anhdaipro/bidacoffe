import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db';
class BilliardTable extends Model {
  public id!: number;
  public tableNumber!: number;
  public status!: number;
  public hourlyRate!: number;
  public type!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BilliardTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tableNumber: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    hourlyRate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BilliardTable',
    tableName: 'billiard_table',
    underscored: true,
    timestamps: true, // Tự động thêm createdAt và updatedAt
  },
);

export default BilliardTable;