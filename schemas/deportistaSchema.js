import { z } from 'zod';

export const DeportistaSchema = z.object({
  cedula_deportista: z.string().min(1, { message: "La cédula es obligatoria" }),
  nombre_deportista: z.string().min(1, { message: "El nombre es obligatorio" }),
  direccion_deportista: z.string().min(1, { message: "La dirección es obligatoria" }),
  telefono_deportista: z.string().min(1, { message: "El teléfono es obligatorio" }),
  eps_deportista: z.string().min(3, { message: "La EPS es obligatoria" }),
  fecha_nacimiento_deportista: z.string().min(1, { message: "La fecha de nacimiento es obligatoria" }),
  nombre_padre_madre: z.string().min(1, { message: "El nombre del padre o madre es obligatorio" }),
  sede: z.string().min(1, { message: "La sede es obligatoria" }),
});
