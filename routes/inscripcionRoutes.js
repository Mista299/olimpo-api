import express from 'express';
import { crearInscripcion, obtenerInscripciones } from '../controllers/inscripcionController.js';
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/', verificarToken, verificarAdmin, crearInscripcion);
router.get('/', verificarToken, verificarAdmin, obtenerInscripciones);

export default router;
