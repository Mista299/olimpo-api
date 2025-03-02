
import express from 'express';
import { crearDeportista, obtenerDeportistas, editarDeportista, editarDeportistaFromUser } from '../controllers/deportistaController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/', crearDeportista, verificarToken);
//editar como admin
router.get('/', verificarToken, verificarAdmin, obtenerDeportistas);
router.put('/:cedula_deportista', verificarToken, verificarAdmin, editarDeportista );
//editar como usuario
router.put('/editar', verificarToken, editarDeportistaFromUser );

export default router;
