import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db';
import User from './User';
import Shift from './Shift';

class TimeSheet extends Model {
  public id!: number;
  public employeeId!: number;
  public shiftId!: number;
  public checkInTime!: Date;
  public checkOutTime!: Date;
  public status!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TimeSheet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    shiftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 'ABSENT',
    },
  },
  {
    sequelize,
    modelName: 'TimeSheet',
    tableName: 'time_sheet',
    timestamps: true,
    underscored: true,
  }
);

export default TimeSheet;
