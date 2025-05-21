import { Router } from 'express';
import { ProductController, upload } from '../controllers/ProductController';
import { authenticateJWT, handleMulterError } from '../middleware';
import { loadModel } from '../middleware/product';
const router = Router();
router.use(authenticateJWT);
router.post('/products/create', upload.single('image'), ProductController.createProduct);
router.get('/products', ProductController.getAllProducts);
router.get('/products/search', ProductController.getAllProductsSearch);
router.get('/products/view/:id', loadModel, ProductController.getProductById);
router.post('/products/update/:id',loadModel, upload.single('image'), handleMulterError,  ProductController.updateProduct);
router.post('/products/delete/:id',loadModel, ProductController.deleteProduct);
router.post('/products/create-mutiple', ProductController.createMutiple);
router.post('/products/update-status/:id',loadModel, ProductController.setStatus);

export default router;