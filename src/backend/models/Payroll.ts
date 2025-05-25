import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db';

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