import mongoose from 'mongoose';
import inscripcionSchema from './inscripcionSchema.js'; // Importamos el esquema, no el modelo

// Esquema de deportista
const deportistaSchema = new mongoose.Schema({
  nombre_deportista: { type: String, required: true },
  cedula_deportista: { type: Number, required: true, unique: true },
  direccion_deportista: { type: String, required: true },
  telefono_deportista: { type: String, required: true },
  eps_deportista: { type: String, required: true },
  fecha_nacimiento_deportista: { type: Date, required: true },
  nombre_padre_madre: { type: String, required: true },
  sede: { type: String, required: true }, // Las 4 sedes: Medellín, Rionegro, La Ceja, El Retiro
  terminos_aceptados: { type: Boolean, required: true },
  fecha_inscripcion: { type: Date, default: Date.now },
  
  // Información opcional de inscripción
  inscripcion: { type: inscripcionSchema, required: false } // Usamos el esquema como tipo
});

deportistaSchema.index({ cedula_deportista: 1 }, { unique: true });

export default mongoose.model('Deportista', deportistaSchema); // Exportamos el modelo
