import express from 'express';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import { agregarUsuario, obtenerTodosLosUsuarios, eliminarUsuario, editarUsuarioFromUser } from '../controllers/userController.js';

const router = express.Router();

//general
router.post('/', agregarUsuario);

// Ruta protegida para obtener todos los usuarios (GET)

//editar como admin
router.get('/usuarios', verificarToken, verificarAdmin, obtenerTodosLosUsuarios);
router.delete('/usuarios/:email', verificarToken, verificarAdmin, eliminarUsuario);
//editar como usuario
router.put('/usuarios', verificarToken, editarUsuarioFromUser);

export default router;
