import { Sequelize } from 'sequelize';

// Kết nối với MySQL
const sequelize = new Sequelize('bida', 'root', 'anhdai123', {
  host: 'localhost', // Địa chỉ MySQL server
  dialect: 'mysql',  // Sử dụng MySQL
  logging: false,    // Tắt log SQL (tuỳ chọn)
  timezone: '+07:00', // múi giờ VN
  dialectOptions: {
    dateStrings: true,
    typeCast: true
  },
});

export default sequelize;