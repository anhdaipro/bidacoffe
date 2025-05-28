import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../database/db';
import User from './User';
import dayjs from 'dayjs';
import { ROLE_EMPLOYEE } from '../BidaConst';
import Shift from './Shift';
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
  public createdAtBigint!: number;
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
  public async cronGenerateWeeklySchedule(){
    const today = dayjs();
    const startOfNextWeek = today.add(1, 'week').startOf('week');
    const endOfNextWeek = startOfNextWeek.add(6, 'day');

    const employees = await User.findAll({
      where: {
        roleId: ROLE_EMPLOYEE,
      },
    });

    const shifts = await Shift.findAll({ attributes: ['id'] });
    const aShiftId = shifts.map(shift => shift.get('id'));

    for (const emp of employees) {
      const lastWeek = await Schedule.findAll({
        where: {
          employeeId: emp.id,
          workDate: {
            [Op.between]: [
              startOfNextWeek.clone().subtract(7, 'day').format('YYYY-MM-DD'),
              startOfNextWeek.clone().subtract(1, 'day').format('YYYY-MM-DD'),
            ],
          },
        },
      });

      const usedShifts = lastWeek.map(s => s.shiftId);

      for (let i = 0; i < 7; i++) {
        const workDate = dayjs(startOfNextWeek).add(i, 'day').format('YYYY-MM-DD');

        let possibleShifts = aShiftId.filter(s => !usedShifts.includes(s));
        if (possibleShifts.length === 0) {
          possibleShifts = aShiftId; // fallback nếu hết ca khác
        }

        const randomShift = possibleShifts[Math.floor(Math.random() * possibleShifts.length)];

        await Schedule.create({
          employeeId: emp.id,
          shiftId: randomShift,
          workDate,
        });

        usedShifts.push(randomShift);
      }
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
    createdAtBigint: {
      type: DataTypes.BIGINT,
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