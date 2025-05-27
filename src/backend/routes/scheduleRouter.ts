import express from 'express';
import ScheduleController from '../controllers/ScheduleController';

const router = express.Router();

router.post('/create', ScheduleController.createSchedules); // Tạo nhiều lịch làm việc
router.get('', ScheduleController.getAllSchedules); // Lấy danh sách lịch làm việc
router.post('/update', ScheduleController.updateSchedules); // Cập nhật nhiều lịch làm việc
router.post('/delete/:id', ScheduleController.deleteSchedule); // Xóa lịch làm việc
router.post('/checkin/:id', ScheduleController.checkIn); // Check-in
router.post('/checkout/:id', ScheduleController.checkOut); // Check-out

export default router;