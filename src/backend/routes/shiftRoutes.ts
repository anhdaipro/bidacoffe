import { Router } from 'express';
import ShiftController from '../controllers/ShiftController';

const router = Router();

router.post('/shifts', ShiftController.createShift);
router.get('/shifts', ShiftController.getAllShifts);
router.get('/shifts/:id', ShiftController.getShiftById);
router.put('/shifts/:id', ShiftController.updateShift);
router.delete('/shifts/:id', ShiftController.deleteShift);
router.post('/shifts/calculate-salary', ShiftController.calculateMonthlySalary);

export default router;