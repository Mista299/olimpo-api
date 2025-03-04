import express from 'express';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/database.js';
import deportistaRoutes from './routes/deportistaRoutes.js';
import inscripcionRoutes from './routes/inscripcionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import router from './routes/router.js';
import cors from 'cors';

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser()); // Para manejar cookies

// Configuración CORS
const allowedOrigins = ['http://localhost:5173', 'https://olimpo-api.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  credentials: true, // Permitir el envío de credenciales (cookies, headers)
}));

// Conectar a la base de datos
connectToDatabase();

// Definir rutas
app.use('/api/deportistas', deportistaRoutes);
app.use('/api/inscripciones', inscripcionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/', router);

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
