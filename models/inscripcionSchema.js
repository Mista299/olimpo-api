import mongoose from 'mongoose';
import pagoSchema from './pagoSchema.js'; // Asegúrate de que este archivo exista

// Esquema de inscripción
const inscripcionSchema = new mongoose.Schema({
  fecha_inscripcion: { type: Date, default: Date.now },
  fecha_vencimiento: { type: Date, required: true },
  estado_mensualidad: {
    type: String,
    enum: ['activo', 'pendiente', 'vencido'], // Estados posibles
    default: 'pendiente', // Valor por defecto
    required: true
  },
  historial_pagos: [pagoSchema]
}, { _id: false }); // No necesitas un _id para cada inscripción si no es necesario

export default inscripcionSchema;