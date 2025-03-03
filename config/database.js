// database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

// Construir la URI de conexión usando variables de entorno
const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@library0.t6p18uw.mongodb.net/${process.env.MONGO_DB_NAME}`;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Usando conexión existente');
    return;
  }

  try {
    const db = await mongoose.connect(URI, {
    });
    isConnected = db.connections[0].readyState;
    console.log('Nueva conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    throw new Error('Error al conectar a la base de datos');
  }
};
