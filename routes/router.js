// Archivo: router.js
import express from 'express';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import { enviarDatosUsuario } from '../controllers/userController.js';

const router = express.Router();

router.get('/admin-panel', verificarToken, verificarAdmin, enviarDatosUsuario);
router.get('/user-panel', verificarToken, enviarDatosUsuario);

export default router;
