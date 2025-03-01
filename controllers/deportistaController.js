import Deportista from '../models/deportistaSchema.js';  // Asegúrate de tener tu modelo de "Deportista"
import User from './models/user.js'; // Asegúrate de importar tu modelo de User

// Controlador para crear un deportista
export const crearDeportista = async (req, res) => {
  const { nombre_deportista, cedula_deportista, email_deportista, direccion_deportista, telefono_deportista, eps_deportista, fecha_nacimiento_deportista, nombre_padre_madre, sede, terminos_aceptados } = req.body;

  try {
    // Verifica si ya existe un deportista con la misma cédula
    const deportistaExistente = await Deportista.findOne({ cedula_deportista });

    if (deportistaExistente) {
      return res.status(400).json({
        message: 'El deportista con esta cédula ya existe.',
      });
    }

    // Si no existe, crea el nuevo deportista
    const nuevoDeportista = new Deportista({
      nombre_deportista,
      cedula_deportista,
      email_deportista,
      direccion_deportista,
      telefono_deportista,
      eps_deportista,
      fecha_nacimiento_deportista,
      nombre_padre_madre,
      sede,
      terminos_aceptados,
    });

    // Guarda el deportista en la base de datos
    await nuevoDeportista.save();

    res.status(201).json({
      message: 'Deportista creado exitosamente',
      deportista: nuevoDeportista,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el deportista',
      error: error.message,
    });
  }
};

export const obtenerDeportistas = async (req, res) => {
  try {
    // Busca todos los deportistas en la base de datos
    const deportistas = await Deportista.find();

    // Si no hay deportistas, envía un mensaje
    if (deportistas.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron deportistas.',
      });
    }

    // Devuelve la lista de deportistas
    res.status(200).json(deportistas);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los deportistas',
      error: error.message,
    });
  }
};

// Método para vincular un deportista existente a un usuario usando el email del usuario y la cédula del deportista
export const vincularDeportistaExistenteAUsuario = async (emailUsuario, cedulaDeportista) => {
  try {
    // Buscamos el usuario por su email
    const usuario = await User.findOne({ email: emailUsuario });
    if (!usuario) {
      return { message: 'Usuario no encontrado' };
    }

    // Buscamos el deportista existente por su cédula
    const deportistaExistente = await Deportista.findOne({ cedula_deportista: cedulaDeportista });
    if (!deportistaExistente) {
      return { message: 'Deportista no encontrado' };
    }

    // Vinculamos el deportista con el usuario (asumimos que el usuario tiene un campo `deportista`)
    usuario.deportista = deportistaExistente._id;
    await usuario.save();

    return { message: 'Deportista vinculado al usuario exitosamente', usuario };
  } catch (error) {
    return { message: 'Error al vincular deportista al usuario', error };
  }
};