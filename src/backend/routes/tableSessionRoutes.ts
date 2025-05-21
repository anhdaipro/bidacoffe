import { Router } from 'express';
import TableSessionController from '../controllers/TableSessionController';

const router = Router();

router.post('/tablesession/create', TableSessionController.createTableSession);
router.post('/tablesession/start', TableSessionController.startTableSession);
router.get('/tablesession', TableSessionController.getAllTableSessions);
router.get('/tablesession/view/:id', TableSessionController.getTableSessionById);
router.post('/tablesession/update/:id', TableSessionController.updateTableSession);
router.post('/tablesession/delete/:id', TableSessionController.deleteTableSession);
router.post('/tablesession/finish/:id', TableSessionController.finishTableSession);
router.post('/tablesession/order/:id', TableSessionController.orderProductTableSession);
router.post('/tablesession/reward/:id', TableSessionController.createRewardTableSession);
export default router;