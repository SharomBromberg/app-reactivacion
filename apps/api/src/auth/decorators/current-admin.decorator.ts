import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { AuthenticatedAdmin } from '../types/authenticated-admin.type';

/** Extrae el admin autenticado (seteado por JwtStrategy) del request. */
export const CurrentAdmin = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedAdmin => {
  const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedAdmin }>();
  return request.user;
});
