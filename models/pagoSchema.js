import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  fecha_pago: { type: Date, default: Date.now },
  monto: { type: Number, required: true },
  metodo_pago: { type: String, required: true },
  estado: { type: String, default: 'Inactivo' } // Valores posibles: 'Pagado', 'Pendiente'
}, { _id: false });

export default pagoSchema;
