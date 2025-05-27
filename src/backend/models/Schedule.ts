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
    const startOfNextWeek = today.add(1, 'week').startOf('week'); // CN
    const endOfNextWeek = startOfNextWeek.add(6, 'day');

    // Lấy danh sách nhân viên
    const employees = await User.findAll({
      where:{
        roleId:ROLE_EMPLOYEE
      }
    });

    for (const emp of employees) {
      const lastWeek = await Schedule.findAll({
        where: {
          employeeId: emp.id,
          date: {
            $between: [
              startOfNextWeek.subtract(7, 'day').format('YYYY-MM-DD'),
              startOfNextWeek.subtract(1, 'day').format('YYYY-MM-DD'),
            ],
          },
        },
      });
      const shifts = await Shift.findAll({
        attributes:['id']
      })
      const aShiftId = shifts.map(shift=>{
        return shift.get('id')
      })
      const usedShifts = lastWeek.map(s => s.shiftId); // để tránh lặp

      for (let i = 0; i < 7; i++) {
        const workDay = startOfNextWeek.add(i, 'day').format('YYYY-MM-DD');

        // logic: xoay vòng ca làm, hoặc random không trùng ca
        const possibleShifts = aShiftId.filter(
          s => !usedShifts.includes(s)
        );

        const randomShift = possibleShifts[Math.floor(Math.random() * possibleShifts.length)];

        await Schedule.create({
          employeeId: emp.id,
          shift: randomShift,
          workDay,
        });

        usedShifts.push(randomShift); // tránh bị trùng trong tuần mới
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