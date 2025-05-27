import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { authenticateJWT, handleMulterError } from '../middleware';
import { loadModel } from '../middleware/product';
import { configureMulter } from '../middleware/upload';
const router = Router();
export const folder = '/uploads/product';
const upload = configureMulter(folder, 1 * 1024 * 1024); // Giới hạn kích thước file là 5MB
router.use(authenticateJWT);
router.post('/create', upload.single('image'), ProductController.createProduct);
router.get('', ProductController.getAllProducts);
router.get('/search', ProductController.getAllProductsSearch);
router.get('/view/:id', loadModel, ProductController.getProductById);
router.post('/update/:id',loadModel, upload.single('image'), handleMulterError,  ProductController.updateProduct);
router.post('/delete/:id',loadModel, ProductController.deleteProduct);
router.post('/create-mutiple', ProductController.createMutiple);
router.post('/update-status/:id',loadModel, ProductController.setStatus);

export default router;