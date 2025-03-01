import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, required: true }, // Ejemplo: "admin" o "deportista"
  
  // Referencia opcional a deportista
  deportista: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deportista', // Apunta al modelo Deportista
    required: false // El usuario no necesariamente tiene que ser un deportista desde el inicio
  }
});

export default mongoose.model('User', userSchema);
