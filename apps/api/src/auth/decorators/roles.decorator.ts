import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Marca una ruta/controller como accesible solo para los roles indicados. */
export const Roles = (...roles: string[]): ReturnType<typeof SetMetadata> => SetMetadata(ROLES_KEY, roles);
