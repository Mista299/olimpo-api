import Deportista from '../models/deportistaSchema.js'; 
import User from '../models/userSchema.js'; 
import { DeportistaSchema } from '../schemas/deportistaSchema.js';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const enviarEmailInscripcion = async (deportista) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "olimpogimnasiaclub@gmail.com",
      subject: 'Inscripción Exitosa - Olimpo Academia de Gimnasia',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0055a5;">Inscripción Confirmada</h2>
          <p>¡Hola! Te confirmamos que la inscripción del deportista ha sido exitosa. Aquí están los detalles:</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Nombres y apellidos del deportista:</td>
              <td style="padding: 8px;">${deportista.nombre_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Cédula o tarjeta de identidad:</td>
              <td style="padding: 8px;">${deportista.cedula_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Dirección de residencia:</td>
              <td style="padding: 8px;">${deportista.direccion_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Teléfono del deportista:</td>
              <td style="padding: 8px;">${deportista.telefono_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Dirección:</td>
              <td style="padding: 8px;">${deportista.direccion_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">EPS del deportista:</td>
              <td style="padding: 8px;">${deportista.eps_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Fecha de nacimiento:</td>
              <td style="padding: 8px;">${deportista.fecha_nacimiento_deportista}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Nombre del padre/madre:</td>
              <td style="padding: 8px;">${deportista.nombre_padre_madre}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Sede seleccionada:</td>
              <td style="padding: 8px;">${deportista.sede}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Horario de la sede:</td>
              <td style="padding: 8px;">${deportista.horario_sede || 'No especificado'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Aceptó términos y condiciones:</td>
              <td style="padding: 8px;">Sí</td>
            </tr>
          </table>

          <p style="margin-top: 20px;">Gracias por confiar en <strong>Olimpo Academia de Gimnasia</strong>.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo de inscripción enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
  }
};

export const crearDeportista = async (req, res) => {
  const { nombre_deportista, cedula_deportista, direccion_deportista, telefono_deportista, eps_deportista, fecha_nacimiento_deportista, nombre_padre_madre, sede} = req.body;

  try {
    console.log("Validando datos recibidos: ");
    console.log(req.body);
    
    // Validación con Zod
    const validatedData = DeportistaSchema.parse(req.body);
    console.log("Datos validados correctamente.");

    // Verificar si el deportista ya existe
    const deportistaExistente = await Deportista.findOne({ cedula_deportista });
    if (deportistaExistente) {
      console.log("El deportista con esta cédula ya existe.");
      return res.status(400).json({
        message: 'El deportista con esta cédula ya existe.',
      });
    }

    // Si no existe, crear el nuevo deportista
    console.log("Creando nuevo deportista...");
    const nuevoDeportista = new Deportista(validatedData);
    
    // Guardar el deportista en la base de datos
    await nuevoDeportista.save();
    console.log("Deportista guardado correctamente.");
    req.nuevoDeportista = nuevoDeportista;
    await enviarEmailInscripcion(nuevoDeportista); 
    res.status(201).json({
      message: 'Deportista creado y correo enviado exitosamente',
      deportista: nuevoDeportista
    });
  } catch (error) {
    // Manejo de errores de Zod
    if (error instanceof z.ZodError) {
      console.log("Error de validación con Zod:", error.errors);
      return res.status(400).json({
        message: 'Error en la validación de datos',
        errors: error.errors,
      });
    }

    // Otros errores, como errores en la base de datos
    console.log("Error al crear el deportista:", error.message);
    return res.status(500).json({
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

    // Convertimos la fecha al formato corto para cada deportista
    const deportistasConFechaFormateada = deportistas.map(deportista => ({
      ...deportista._doc, // Copia todas las propiedades del documento original
      fecha_nacimiento_deportista: new Date(deportista.fecha_nacimiento_deportista).toISOString().split('T')[0] // Formatea la fecha
    }));

    res.status(200).json(deportistasConFechaFormateada);
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
      console.log(req.body); // Agrega este log para depurar los datos recibidos

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

export const eliminarDeportista = async (req, res) => {
  const _id = req.params._id; // Captura el _id desde la URL

  try {
    // Busca y elimina el deportista por _id
    const deportistaEliminado = await Deportista.findByIdAndDelete(_id);

    if (!deportistaEliminado) {
      return res.status(404).json({
        message: 'Deportista no encontrado.',
      });
    }

    res.status(200).json({
      message: 'Deportista eliminado exitosamente',
      deportista: deportistaEliminado, // Puedes devolver los detalles del deportista eliminado si es necesario
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el deportista.',
      error: error.message,
    });
  }
};