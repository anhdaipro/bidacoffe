import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import { authenticateJWT, handleMulterError } from '../middleware';
import { configureMulter } from '../middleware/upload';
const router = Router();
export const folder = '/uploads/user'
const upload = configureMulter(folder, 1 * 1024 * 1024); // Giới hạn kích thước file là 5MB
const employeeUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cccdFront', maxCount: 1 }, { name: 'cccdBack', maxCount: 1 }]);
// Tạo người dùng mới
router.use(authenticateJWT);
router.post('/create',employeeUpload, handleMulterError, EmployeeController.createEmployee);
router.post('/update/:id',employeeUpload, handleMulterError, EmployeeController.updateEmployee);
router.get('', EmployeeController.getAllEmployee);
router.get('/view/:id', EmployeeController.getEmployeeById);
router.get('/schedule', EmployeeController.getEmployeeSchedule);
// // Cập nhật thông tin người dùng
// router.put('/users/:id', UserController.updateUser);

// // Xóa người dùng
// router.delete('/users/:id', UserController.deleteUser);

export default router;