import Inscripcion from '../models/inscripcionSchema.js';

// Crear una nueva mensualidad
export const crearInscripcion = async (req, res) => {
  try {
    const nuevaInscripcion = new Inscripcion(req.body);
    await nuevaInscripcion.save();
    res.status(201).json(nuevaInscripcion);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear mensualidad', error });
  }
};

// Obtener todas las mensualidades
export const obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find();
    res.status(200).json(inscripciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener inscripciones', error });
  }
};
