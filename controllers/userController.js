import User from './models/user.js'; // Asegúrate de importar tu modelo de User
import bcrypt from 'bcrypt';

// Método para agregar un nuevo usuario
export const agregarUsuario = async (email, password, role) => {
  try {
    // Validamos si el usuario ya existe por el email
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return { message: 'El usuario con este correo ya existe' };
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos un nuevo usuario
    const nuevoUsuario = new User({
      email,
      password: hashedPassword,
      role // Puede ser 'admin' o 'usuario'
    });

    // Guardamos el usuario en la base de datos
    await nuevoUsuario.save();
    return { message: 'Usuario creado exitosamente', usuario: nuevoUsuario };
  } catch (error) {
    return { message: 'Error al crear el usuario', error };
  }
};
