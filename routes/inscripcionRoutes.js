import express from 'express';
import { crearInscripcion, obtenerInscripciones } from '../controllers/inscripcionController.js';

const router = express.Router();

// Ruta POST para crear una mensualidad
router.post('/', crearInscripcion);

// Ruta GET para obtener todas las mensualidades
router.get('/', obtenerInscripciones);

export default router;
