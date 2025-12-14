import { Router } from 'express';
import { PurchaseController } from '../controllers/purchaseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const purchaseController = new PurchaseController();

// All routes require authentication
router.use(authenticateToken);

router.get('/history', purchaseController.getHistory);

export default router;

