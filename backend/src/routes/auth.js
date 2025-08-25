import express from 'express';
import AuthController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Rutas protegidas
router.get('/profile', authenticate, AuthController.getProfile);
router.post('/logout', authenticate, AuthController.logout);

export default router;
