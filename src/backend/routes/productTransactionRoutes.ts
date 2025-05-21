import { Router } from 'express';
import ProductTransactionController from '../controllers/ProductTransactionController';
import { authenticateJWT } from '../middleware';

const router = Router();
router.use(authenticateJWT);
router.post('/product-transactions/create', ProductTransactionController.createProductTransaction);
router.get('/product-transactions', ProductTransactionController.getAllProductTransactions);
router.get('/product-transactions/view/:id', ProductTransactionController.getProductTransactionById);
router.post('/product-transactions/update/:id', ProductTransactionController.updateProductTransaction);
router.post('/product-transactions/delete/:id', ProductTransactionController.deleteProductTransaction);

export default router;