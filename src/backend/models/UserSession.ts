import { DataTypes, Model } from 'sequelize';
import sequelize from '@backend/database/db';
export interface DeviceInfo {
  platform: 'mobile' | 'web';
  os: string | null;               // Android, iOS, Windows, macOS,...
  osVersion: string | null;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  brand: string | null;
  model: string | null;
  browser: string | null;          // Chrome, Safari,... (null nếu là mobile app)
  browserVersion: string | null;
  uniqueId: string | null;         // UUID cho app, null cho web
  isEmulator: boolean;
}
class UserSession extends Model {
    public id!: number; // ID của bản ghi
    public userId!: number; // ID của người dùng (liên kết với bảng User)
    public accessToken!: string; // Tên của người dùng
    public refreshToken!: string; // Số điện thoại của người dùng (có thể null)
    public deviceInfo!: DeviceInfo; // Số điện thoại của người dùng (có thể null)
    public ip!: string; // Số điện thoại của người dùng (có thể null)
    public loginAt!: string; // Số điện thoại của người dùng (có thể null)
    public readonly createdAt!: Date; // Thời gian tạo bản ghi
    public readonly updatedAt!: Date; // Thời gian cập nhật bản ghi
}
UserSession.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deviceInfo: {
    type: DataTypes.JSON
  },
  ip: {
    type: DataTypes.STRING
  },
  loginAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
    sequelize,
    timestamps: true, // Tự động thêm createdAt và updatedAt
    modelName: 'UserSession',
    tableName: 'user_seesions',
});

export default UserSession;