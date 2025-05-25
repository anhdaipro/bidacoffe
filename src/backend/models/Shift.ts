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
  public employeeId!: number;
  public startTime!: Date;
  public endTime!: Date;
  public shiftType!: number; // 1: Ca sáng, 2: Ca chiều, 3: Ca tối
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Phương thức tĩnh để tính lương
  public static async calculateMonthlySalary(
    employeeId: number,
    startDate: Date,
    endDate: Date,
    salaryPerShift: number
  ): Promise<number> {
    // Đếm số ca làm việc của nhân viên trong khoảng thời gian
    const shiftCount = await Shift.count({
      where: {
        employeeId,
        startTime: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Tính tổng lương
    return shiftCount * salaryPerShift;
  }
}

Shift.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:User,
        key:'id',
      }
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    shiftType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: SHIFT_TYPES.MORNING,
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