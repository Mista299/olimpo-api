
import express from 'express';
import { crearDeportista, obtenerDeportistas, editarDeportista, eliminarDeportista, editarDeportistaFromUser } from '../controllers/deportistaController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/', crearDeportista, verificarToken);
//editar como admin
router.get('/', verificarToken, verificarAdmin, obtenerDeportistas);
router.put('/:_id', verificarToken, verificarAdmin, editarDeportista );
router.delete('/deportistas/:_id',verificarToken, verificarAdmin, eliminarDeportista);
//editar como usuario
router.put('/editar', verificarToken, editarDeportistaFromUser );

export default router;
