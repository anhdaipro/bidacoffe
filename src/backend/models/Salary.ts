import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../database/db';
import dayjs from 'dayjs';
import Schedule from './Schedule';
class Salary extends Model {
    public id!: number;
    public employeeId!: number;
    public workDate!: string;
    public baseSalary!: number;
    public penalty!: number;
    public finalSalary!: number;
    public workDateBigint!:number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    
    // Method to calculate final salary
    public calculateFinalSalary(): number {
        return this.baseSalary - this.penalty;
    }
}
    Salary.init(
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
    workDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    workDateBigint: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    baseSalary: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    penalty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    finalSalary: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    },
    {
    sequelize,
    modelName: 'Salary',
    tableName: 'salary',
    timestamps: true,
    underscored: true,
    }
);
export default Salary;
  