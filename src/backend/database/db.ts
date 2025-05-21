import { Sequelize } from 'sequelize';

// Kết nối với MySQL
const sequelize = new Sequelize('bida', 'root', 'anhdai123', {
  host: 'localhost', // Địa chỉ MySQL server
  dialect: 'mysql',  // Sử dụng MySQL
  logging: false,    // Tắt log SQL (tuỳ chọn)
});

export default sequelize;