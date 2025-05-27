import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../database/db';
import User from './User';
  // Định nghĩa các loại ca làm việc
export enum SHIFT_TYPES {
    MORNING= 1,
    AFTERNOON= 2,
    NIGHT= 3,
};
export const SHIFT_LABELS: Record<SHIFT_TYPES, string> = {
    [SHIFT_TYPES.MORNING]: 'Ca sáng',
    [SHIFT_TYPES.AFTERNOON]: 'Ca chiều',
    [SHIFT_TYPES.NIGHT]: 'Ca tối',
  };
class Shift extends Model {
  public id!: number;
  public name!: string;
  public startTime!: string; // format: "HH:mm:ss"
  public endTime!: string;   // format: "HH:mm:ss"
  public description!: string;
  public status!:number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

Shift.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Shift',
    timestamps: true,
    underscored: true,
  },
);

export default Shift;