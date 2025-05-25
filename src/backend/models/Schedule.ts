import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../database/db';
import User from './User';
class Schedule extends Model {
  public id!: number;
  public employeeId!: number;
  public shiftId!:number;
  public workDate!: Date;
  public status!: Date;
  public checkIn!: Date; 
  public checkOut!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public async calculateSalary(employeeId: number, startDate: Date, endDate: Date): Promise<number> {
    try {
        // Bảng ánh xạ mức lương theo ca
        const shiftSalaryRates: { [key: number]: number } = {
            1: 100000, // Lương ca 1 (ví dụ: 100,000 VND/giờ)
            2: 120000, // Lương ca 2
            3: 150000, // Lương ca 3
        };
    
        // Lấy dữ liệu từ bảng Schedule
        const schedules = await Schedule.findAll({
            where: {
            employeeId,
            workDate: {
                [Op.between]: [startDate, endDate],
            },
            status: 1, // Chỉ tính lương cho các ngày làm việc hợp lệ
            },
        });
    
        let totalSalary = 0;
    
        // Tính lương cho từng bản ghi
        for (const schedule of schedules) {
            const { checkIn, checkOut, shiftId } = schedule;
    
            if (checkIn && checkOut) {
            // Tính số giờ làm việc
            const hoursWorked = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60);
    
            // Lấy mức lương theo ca
            const hourlyRate = shiftSalaryRates[shiftId] || 0;
    
            // Tính lương cho bản ghi này
            totalSalary += hoursWorked * hourlyRate;
            }
        }
    
        return totalSalary;
        } catch (error) {
        console.error('Error calculating salary:', error);
        throw new Error('Không thể tính lương');
        }
    }
}

Schedule.init(
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
    shiftId: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    workDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    checkIn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    checkOut: {
        type: DataTypes.DATE,
        allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Schedule',
    timestamps: true,
    underscored: true,
  },
);

export default Schedule;