import express from 'express';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import { agregarUsuario, obtenerTodosLosUsuarios, eliminarUsuario, editarUsuarioFromUser } from '../controllers/userController.js';

const router = express.Router();

//general
router.post('/', agregarUsuario);

// Ruta protegida para obtener todos los usuarios (GET)

//editar como admin
router.get('/', verificarToken, verificarAdmin, obtenerTodosLosUsuarios);
router.delete('/:email', verificarToken, verificarAdmin, eliminarUsuario);
//editar como usuario
router.put('/', verificarToken, editarUsuarioFromUser);

export default router;
