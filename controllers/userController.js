import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/userSchema.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const autenticarUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la contraseña guardada
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si las credenciales son válidas, generamos un token JWT
    const token = jwt.sign(
      { userId: usuario._id, role: usuario.role }, // Información que deseas codificar
      JWT_SECRET,
      { expiresIn: '1h' } // Duración del token
    );

    // Enviar el token y los datos del usuario al frontend
    res.json({
      message: 'Autenticación exitosa',
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error en la autenticación', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si la autenticación es correcta, generar un token
    const token = jwt.sign({ id: usuario._id, role: usuario.role }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,       // Evita que la cookie sea accesible desde JavaScript (previene XSS)
      secure: true,         // Asegura que la cookie solo se envíe a través de HTTPS
      maxAge: 60 * 60 * 1000 // La cookie expirará en 1 hora
  });

    res.status(200).json({ message: 'Autenticación exitosa', token });
  } catch (error) {
    console.error('Error en el servidor:', error);  // Agregar log detallado
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

export const agregarUsuario = async (req, res) => {
  const { email, password, role } = req.body; // Obtenemos los datos del cuerpo de la solicitud

  try {
    // Validamos si el usuario ya existe por el email
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario con este correo ya existe' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      email,
      password: hashedPassword,
      role // Puede ser 'admin' o 'usuario'
    });

    // Guardamos el usuario en la base de datos
    await nuevoUsuario.save();
    
    return res.status(201).json({ message: 'Usuario creado exitosamente', usuario: nuevoUsuario });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el usuario', error });
  }
};


export const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find(); // Esto obtiene todos los usuarios de la base de datos
    res.status(200).json({ message: 'Usuarios obtenidos exitosamente', usuarios });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};

// Método para eliminar un usuario
export const eliminarUsuario = async (req, res) => {
  const { email } = req.params; // Obtenemos el email del usuario de los parámetros de la ruta
  
  try {
    // Buscar y eliminar el usuario por su email
    const usuarioEliminado = await User.findOneAndDelete({ email });
    
    if (!usuarioEliminado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      usuario: usuarioEliminado, // Devuelve el usuario eliminado como confirmación
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el usuario',
      error: error.message,
    });
  }
};

export const enviarDatosUsuario = (req, res) => {
  res.json({
    message: `Bienvenido al panel de ${req.user.role}`,
    usuarioAutenticado: req.user // Devuelve la data completa del usuario autenticado
  });
};

// Controlador para editar el email y la contraseña sólo desde el usuario autenticado
export const editarUsuarioFromUser = async (req, res) => {
  try {
    // 1. Obtener el ID del usuario autenticado desde el token (req.user.id)
    const usuarioId = req.user.id;
    
    // 2. Obtener el email, la nueva contraseña y la contraseña antigua del cuerpo de la solicitud
    const { email, password, oldPassword } = req.body;
    const usuario = await User.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    if (email) {
      usuario.email = email;
    }

    // 6. Verificar la contraseña antigua antes de permitir el cambio de la nueva
    if (password) {
      if (!oldPassword) {
        return res.status(400).json({ message: 'Debe proporcionar la contraseña antigua para cambiarla.' });
      }

      // Comparar la contraseña antigua con la almacenada en la base de datos
      const isMatch = await bcrypt.compare(oldPassword, usuario.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'La contraseña antigua es incorrecta.' });
      }

      // Si la contraseña antigua es correcta, hashear la nueva contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }
    // 7. Guardar el usuario actualizado en la base de datos
    const usuarioActualizado = await usuario.save();
    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      usuario: {
        email: usuarioActualizado.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el usuario',
      error: error.message,
    });
  }
};
