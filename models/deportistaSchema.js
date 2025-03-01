import mongoose from 'mongoose';
import inscripcionSchema from './inscripcionSchema.js'; // Importamos el esquema, no el modelo

// Esquema de deportista
const deportistaSchema = new mongoose.Schema({
  nombre_deportista: { type: String, required: true },
  cedula_deportista: { type: Number, required: true, unique: true },
  email_deportista: {
    type: String,
    required: false,
    unique: true, // Para asegurarte de que no se repitan emails
    match: [/.+\@.+\..+/, 'Por favor ingresa un correo electrónico válido'] // Validación simple para formato de email
  },
  direccion_deportista: { type: String, required: true },
  telefono_deportista: { type: String, required: true },
  eps_deportista: { type: String, required: true },
  fecha_nacimiento_deportista: { type: Date, required: true },
  nombre_padre_madre: { type: String, required: true },
  sede: { type: String, required: true },
  terminos_aceptados: { type: Boolean, required: true },
  fecha_inscripcion: { type: Date, default: Date.now },
  inscripcion: { type: inscripcionSchema, required: false } // Usamos el esquema como tipo
});

deportistaSchema.index({ cedula_deportista: 1 }, { unique: true });

export default mongoose.model('Deportista', deportistaSchema); // Exportamos el modelo
