// Archivo: middlewares/auth.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  // Obtener el token desde los headers de la petición
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded; // Decodificamos el token y lo pasamos al request
    next(); // Continuamos con el siguiente middleware o ruta
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido o expirado' });
  }
};

export const verificarAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};