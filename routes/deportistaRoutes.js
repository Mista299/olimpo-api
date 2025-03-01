
import express from 'express';
import { crearDeportista, obtenerDeportistas } from '../controllers/deportistaController.js';

const router = express.Router();

// Ruta POST para crear un deportista
router.post('/', crearDeportista);

// Ruta GET para obtener todos los deportistas
router.get('/', obtenerDeportistas);

export default router;
