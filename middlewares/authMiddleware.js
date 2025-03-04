// Archivo: middlewares/auth.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  console.log('Middleware verificarToken ejecutado');
  console.log('Cookies:', req.cookies);

  const token = req.cookies.putotoken;
  if (!token) {
    console.log('Token no proporcionado');
    return res.status(403).json({ message: 'Acceso denegado, token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verificado correctamente:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Error al verificar el token:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};



export const verificarAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};