import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Exige un JWT válido (Authorization: Bearer ...); responde 401 si falta o es inválido. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
