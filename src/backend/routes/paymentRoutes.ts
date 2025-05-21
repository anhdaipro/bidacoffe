import { Router } from 'express';
import PaymentController,{upload} from '../controllers/PaymentController';
import { authenticateJWT } from '../middleware';

const router = Router();

router.post('/payment/create', PaymentController.createPayment);
router.get('/payment', PaymentController.getAllPayments);
router.get('/payment/view/:id', PaymentController.getPaymentById);
router.post('/payment/update/:id', PaymentController.updatePayment);
router.post('/payment/delete/:id', PaymentController.deletePayment);
router.get('/payment/method/:method', PaymentController.getPaymentsByMethod);
router.post('/payment-qr', PaymentController.createQrCode)
router.post('/excel',upload.single('excel'), PaymentController.uploadExcel)
// router.use(authenticateJWT);
export default router;