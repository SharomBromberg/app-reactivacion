import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginResponseDto } from './dto/login-response.dto';
import type { JwtPayload } from './types/authenticated-admin.type';

const INVALID_CREDENTIALS_MESSAGE = 'Correo o contraseña incorrectos';

// Hash de relleno (no corresponde a ninguna cuenta real). Se verifica contra
// él cuando el email no existe, para que argon2 siempre haga el mismo
// trabajo y el tiempo de respuesta no delate qué correos tienen cuenta de
// moderador (side-channel de timing).
const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$snIclqFx8xNw167H6jWKrQ$jGrq7KAzJZpxzIBQR5NXk4pc3A2IuWJmHQxqpdNrIE0';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const admin = await this.prisma.adminUser.findUnique({ where: { email } });
    const passwordMatches = await argon2.verify(admin?.passwordHash ?? DUMMY_PASSWORD_HASH, password);

    // Mismo mensaje de error y mismo trabajo de verificación exista o no la
    // cuenta: evita revelar qué correos tienen acceso de moderador.
    if (!admin || !passwordMatches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const payload: JwtPayload = { sub: admin.id, email: admin.email, role: 'ADMIN' };

    return {
      accessToken: this.jwtService.sign(payload),
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  }
}
