
import multer from 'multer';
import path from 'path'
import fs from 'fs';
export const configureMulter = (folderPath: string, maxFileSize: number = 1 * 1024 * 1024) => {
    const uploadDir = path.join(__dirname, `../../..${folderPath}`);
  
    // Cấu hình storage cho multer
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    });
  
    // Trả về cấu hình multer
    return multer({
      storage,
      limits: { fileSize: maxFileSize }, // Giới hạn kích thước file
    });
};