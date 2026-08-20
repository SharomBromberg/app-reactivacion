// Esquemas zod para los formularios públicos del cliente.
// Las reglas (longitudes, regex, opcionalidad) deben mantenerse en sync manualmente
// con los DTO de class-validator en apps/api/src/{businesses,support-posts}/dto:
// create-business.dto.ts y create-support-post.dto.ts. El backend sigue validando
// con class-validator; este archivo es la única fuente de verdad del lado del cliente.

import { z } from 'zod';
import { DamageLevel, Sector, SupportPostType, Zone } from './enums';

/** El backend exige el celular en E.164 colombiano: +57 + 10 dígitos. */
export const PHONE_LOCAL_CO_REGEX = /^\d{10}$/;
export const PHONE_E164_CO_REGEX = /^\+57\d{10}$/;

/** Convierte 10 dígitos locales (los que escribe el usuario) al formato que espera la API. */
export function toPhoneE164Co(localPhone: string): string {
  return `+57${localPhone.replace(/\D/g, '')}`;
}

const phoneLocalField = z
  .string()
  .trim()
  .regex(PHONE_LOCAL_CO_REGEX, 'Ingresa 10 dígitos sin espacios.');

/** Honeypot anti-spam: los formularios reales lo dejan vacío. Ver apps/api honeypot.util.ts. */
const honeypotField = z.string().max(0).optional().or(z.literal(''));

export const createBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Ingresa al menos 3 caracteres.')
    .max(80, 'Máximo 80 caracteres.'),
  zone: z.nativeEnum(Zone, { errorMap: () => ({ message: 'Selecciona tu barrio o zona.' }) }),
  sector: z.nativeEnum(Sector, { errorMap: () => ({ message: 'Selecciona el tipo de negocio.' }) }),
  damageLevel: z.nativeEnum(DamageLevel, { errorMap: () => ({ message: 'Selecciona el nivel de afectación.' }) }),
  phone: phoneLocalField,
  description: z.string().trim().max(300, 'Máximo 300 caracteres.').optional().or(z.literal('')),
  website: honeypotField,
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa al menos 2 caracteres.')
    .max(80, 'Máximo 80 caracteres.'),
  description: z.string().trim().max(300, 'Máximo 300 caracteres.').optional().or(z.literal('')),
  website: honeypotField,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const createSupportPostSchema = z.object({
  type: z.nativeEnum(SupportPostType),
  title: z
    .string()
    .trim()
    .min(3, 'Ingresa al menos 3 caracteres.')
    .max(80, 'Máximo 80 caracteres.'),
  description: z
    .string()
    .trim()
    .min(3, 'Cuéntanos qué buscas u ofreces.')
    .max(300, 'Máximo 300 caracteres.'),
  zone: z.nativeEnum(Zone, { errorMap: () => ({ message: 'Selecciona tu barrio o zona.' }) }),
  sector: z.nativeEnum(Sector).optional(),
  phone: phoneLocalField,
  businessId: z.string().optional(),
  website: honeypotField,
});

export type CreateSupportPostInput = z.infer<typeof createSupportPostSchema>;

// El backend (BanDto) solo exige 3-300 caracteres; el mínimo de 10 es una
// barra de calidad más alta del cliente (ver design/Panel de Moderación -
// Alta Fidelidad.dc.html) para que la nota alcance a justificar la decisión
// en el historial de auditoría.
export const banNoteSchema = z
  .string()
  .trim()
  .min(10, 'Ingresa al menos 10 caracteres para justificar la decisión.')
  .max(300, 'Máximo 300 caracteres.');

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Ingresa tu correo.').email('Correo inválido.'),
  password: z.string().min(8, 'Mínimo 8 caracteres.'),
});

export type LoginInput = z.infer<typeof loginSchema>;
