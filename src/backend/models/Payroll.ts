import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db';
import Schedule from './Schedule';
import { Op } from 'sequelize';
import dayjs from 'dayjs';
class Payroll extends Model {
    public id!: number; // ID của bản ghi
    public employeeId!: number; // ID của nhân viên
    public month!: number; // Tháng tính lương
    public year!: number; // Năm tính lương
    public totalHours!: number; // Tổng số giờ làm việc
    public baseSalary!: number; // Lương cơ bản
    public overtimeHours!: number; // Số giờ làm thêm
    public overtimePay!: number; // Tiền làm thêm giờ
    public deductions!: number; // Các khoản khấu trừ
    public bonus!: number; // Tiền thưởng
    public netSalary!: number; // Tổng lương thực nhận
    public note?: string; // Ghi chú bổ sung (có thể null)
    public readonly createdAt!: Date; // Thời gian tạo bản ghi
    public readonly updatedAt!: Date; // Thời gian cập nhật bản ghi
    public async calculateAndSavePayroll(employeeId: number, date: string): Promise<void> {
        try {
            // Bảng ánh xạ mức lương theo ca
            const shiftSalaryRates: { [key: number]: number } = {
                1: 100000, // Lương ca 1 (ví dụ: 100,000 VND/giờ)
                2: 120000, // Lương ca 2
                3: 150000, // Lương ca 3
            };
            // Tính ngày đầu tiên và ngày cuối cùng của tháng
            const startDate = dayjs(`${date}`).startOf('month').toDate();
            const endDate = dayjs(`${date}`).endOf('month').toDate();
            const year = dayjs(`${date}`).get('year')
            const month = dayjs(`${date}`).get('month')
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
        
            let totalHours = 0;
            let overtimeHours = 0;
            let baseSalary = 0;
            let overtimePay = 0;
        
            // Tính lương cho từng bản ghi
            for (const schedule of schedules) {
                const { checkIn, checkOut, shiftId } = schedule;
        
                if (checkIn && checkOut) {
                // Tính số giờ làm việc
                const hoursWorked = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60);
        
                // Tính giờ làm thêm (nếu vượt quá 8 giờ)
                const overtime = hoursWorked > 8 ? hoursWorked - 8 : 0;
        
                // Lấy mức lương theo ca
                const hourlyRate = shiftSalaryRates[shiftId] || 0;
        
                // Cộng dồn
                totalHours += hoursWorked;
                overtimeHours += overtime;
                baseSalary += (hoursWorked - overtime) * hourlyRate;
                overtimePay += overtime * hourlyRate * 1.5; // Tiền làm thêm giờ (1.5x lương cơ bản)
                }
            }
      
            // Tính tổng lương thực nhận
            const deductions = 0; // Các khoản khấu trừ (thuế, bảo hiểm, v.v.)
            const netSalary = baseSalary + overtimePay - deductions;
        
            // Lưu vào bảng Payroll
            await Payroll.create({
                employeeId,
                month,
                year,
                totalHours,
                baseSalary,
                overtimeHours,
                overtimePay,
                deductions,
                netSalary,
            });
      
          console.log(`Đã tính lương cho nhân viên ${employeeId} trong tháng ${month}`);
        } catch (error) {
          console.error('Error calculating payroll:', error);
          throw new Error('Không thể tính lương');
        }
      }
}

Payroll.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bonus:{
    type: DataTypes.INTEGER,
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalHours: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  baseSalary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  overtimeHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  overtimePay: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  deductions: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  netSalary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Payroll',
  tableName: 'payrolls',
});

export default Payroll;