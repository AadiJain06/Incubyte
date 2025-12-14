import { Router } from 'express';
import { SweetController } from '../controllers/sweetController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const sweetController = new SweetController();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', sweetController.findAll);
router.get('/search', sweetController.search);
router.get('/:id', sweetController.findById);
router.post('/:id/purchase', sweetController.purchase);

// Admin only routes
router.post('/', requireAdmin, sweetController.create);
router.put('/:id', requireAdmin, sweetController.update);
router.delete('/:id', requireAdmin, sweetController.delete);
router.post('/:id/restock', requireAdmin, sweetController.restock);

export default router;

