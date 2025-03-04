// Archivo: middlewares/auth.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Decodifica el token y lo agrega al objeto req
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};


export const verificarAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};