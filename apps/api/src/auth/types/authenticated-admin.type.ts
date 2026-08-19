/** Forma de `request.user` una vez que JwtStrategy valida el token. */
export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: 'ADMIN';
}

/** Claims que viajan dentro del JWT firmado en /auth/login. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: 'ADMIN';
}
