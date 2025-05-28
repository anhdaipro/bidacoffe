import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/db';

class UserProfile extends Model {
    public id!: number; // ID của bản ghi
    public userId!: number; // ID của người dùng (liên kết với bảng User)
    public name!: string; // Tên của người dùng
    public phone!: string; // Số điện thoại của người dùng (có thể null)
    public dateOfBirth!: Date; // Ngày sinh của người dùng (có thể null)
    public avatar!: string; // URL ảnh đại diện của người dùng (có thể null)
    public cccdFront!: string; // Tiểu sử hoặc mô tả ngắn của người dùng (có thể null)
    public position!: number; // Ngày sinh của người dùng (có thể null)
    public baseSalary!: number; // Ngày sinh của người dùng (có thể null)
    public cccdBack!: string; // Tiểu sử hoặc mô tả ngắn của người dùng (có thể null)
    public typeEducation!: number; // Ngày sinh của người dùng (có thể null)
    public bankNo!: string; // Tiểu sử hoặc mô tả ngắn của người dùng (có thể null)
    public dateLeave!: Date; // Tiểu sử hoặc mô tả ngắn của người dùng (có thể null)
    public bankId!: number; // Ngày sinh của người dùng (có thể null)
    public bankFullname!: string; // Tiểu sử hoặc mô tả ngắn của người dùng (có thể null)
    public dateBeginJob!: Date; // Tiểu sử hoặc mô tả ngắn của người dùng (có thể null)
    public readonly createdAt!: Date; // Thời gian tạo bản ghi
    public readonly updatedAt!: Date; // Thời gian cập nhật bản ghi
}

UserProfile.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateLeave: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dateBeginJob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  typeEducation: {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
  cccdBack: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cccdFront: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bankId: {
    type: DataTypes.TINYINT,
    allowNull: true,
  },
  bankFullname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bankNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  baseSalary: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  timestamps: true, // Tự động thêm createdAt và updatedAt
  modelName: 'UserProfile',
  tableName: 'user_profile',
  underscored: true,
});

export default UserProfile;