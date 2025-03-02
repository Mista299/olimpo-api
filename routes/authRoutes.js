import express from 'express';
import { login } from '../controllers/userController.js';

const router = express.Router();

// Ruta POST para iniciar sesión
router.post('/login', login);

export default router;
