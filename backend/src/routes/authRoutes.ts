import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

console.log('Setting up auth routes...');
router.post('/register', authController.register);
router.post('/login', authController.login);
console.log('Auth routes registered: POST /register, POST /login');

export default router;

