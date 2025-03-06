import Deportista from '../models/deportistaSchema.js'; 
import User from '../models/userSchema.js'; 
import { DeportistaSchema } from '../schemas/deportistaSchema.js';

export const crearDeportista = async (req, res) => {
  const { nombre_deportista, cedula_deportista, email_deportista, direccion_deportista, telefono_deportista, eps_deportista, fecha_nacimiento_deportista, nombre_padre_madre, sede, terminos_aceptados } = req.body;

  try {
    // Validación con Zod
    const validatedData = DeportistaSchema.parse(req.body); // Si hay errores, Zod lanza una excepción.
    
    const deportistaExistente = await Deportista.findOne({ cedula_deportista });

    if (deportistaExistente) {
      return res.status(400).json({
        message: 'El deportista con esta cédula ya existe.',
      });
    }

    const nuevoDeportista = new Deportista(validatedData);

    await nuevoDeportista.save();

    res.status(201).json({
      message: 'Deportista creado exitosamente',
      deportista: nuevoDeportista,
    });
  } catch (error) {
    // Manejo de errores de validación
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Error en la validación de datos',
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: 'Error al crear el deportista',
      error: error.message,
    });
  }
};


export const obtenerDeportistas = async (req, res) => {
  try {
    const deportistas = await Deportista.find();

    if (deportistas.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron deportistas.',
      });
    }
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

export const newUserDeportista = async (cedulaUsuario, datosDeportista) => {
  try {

    const usuario = await User.findOne({ email: emailUsuario });
    
    if (!usuario) {
      return { message: 'Usuario no encontrado' };
    }

    const nuevoDeportista = new Deportista({
      ...datosDeportista 
    });

    const deportistaGuardado = await nuevoDeportista.save();

    usuario.deportista = deportistaGuardado._id;
    await usuario.save();

    return { message: 'Deportista vinculado al usuario exitosamente', usuario };
  } catch (error) {
    return { message: 'Error al vincular deportista al usuario', error };
  }
};

export const editarDeportista = async (req, res) => {
  const id = req.params._id;

  try {
    const deportista = await Deportista.findById(id);

    if (!deportista) {
      return res.status(404).json({ message: 'Deportista no encontrado' });
    }

    try {
      const validatedData = DeportistaSchema.partial().parse(req.body); // El método partial() permite validar sólo campos enviados

      // Itera sobre las propiedades de req.body y actualiza el documento deportista
      for (const key in validatedData) {
        if (validatedData.hasOwnProperty(key) && deportista[key] !== undefined) {
          deportista[key] = validatedData[key]; // Actualiza cada campo solo si existe en el body validado
        }
      }

      // Guarda los cambios
      await deportista.save();

      res.status(200).json({
        message: 'Deportista actualizado exitosamente',
        deportista,
      });
    } catch (validationError) {
      return res.status(400).json({
        message: 'Datos inválidos',
        error: validationError.errors, // Devuelve los errores de validación específicos
      });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el deportista.',
      error: error.message,
    });
  }
};

import { DeportistaSchema } from '../schemas/deportistaSchema.js'; // Importa tu esquema

export const editarDeportistaFromUser = async (req, res) => {
  const { cedula_deportista } = req.params; 
  const usuarioAutenticado = req.user; 

  try {
    if (usuarioAutenticado.cedula_deportista !== cedula_deportista) {
      return res.status(403).json({
        message: 'No tienes permiso para editar los datos de otro deportista.',
      });
    }

    // Validación con Zod para los datos que se van a actualizar
    const validatedData = DeportistaSchema.parse(req.body);

    const deportistaActualizado = await Deportista.findOneAndUpdate(
      { cedula_deportista },
      validatedData, // Usa los datos validados
      { new: true }
    );

    if (!deportistaActualizado) {
      return res.status(404).json({ message: 'Deportista no encontrado.' });
    }

    res.status(200).json({
      message: 'Deportista actualizado exitosamente',
      deportista: deportistaActualizado,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Error en la validación de datos',
        errors: error.errors,
      });
    }

    res.status(500).json({
      message: 'Error al actualizar el deportista',
      error: error.message,
    });
  }
};


