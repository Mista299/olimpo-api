import express from 'express';
import { connectToDatabase } from './config/database.js';
import deportistaRoutes from './routes/deportistaRoutes.js';
import inscripcionRoutes from './routes/inscripcionRoutes.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
connectToDatabase();

// Definir rutas
app.use('/api/deportistas', deportistaRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

// Ruta de pruebas
app.get('/', (req, res) => {
  res.send('Servidor Express con MongoDB funcionando');
});

// Endpoint de prueba para verificar la conexión
app.get('/conexion', async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({ message: 'Conexión exitosa a la base de datos' });
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar a la base de datos', error: error.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;
