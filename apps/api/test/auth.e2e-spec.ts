import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as argon2 from 'argon2';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const TEST_RUN_ID = `e2e-auth-${Date.now()}`;
  const ADMIN_EMAIL = `${TEST_RUN_ID}@example.com`;
  const ADMIN_PASSWORD = 'correct-horse-battery-staple';
  let adminId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    const passwordHash = await argon2.hash(ADMIN_PASSWORD);
    const admin = await prisma.adminUser.create({
      data: { email: ADMIN_EMAIL, name: 'Admin de prueba', passwordHash },
    });
    adminId = admin.id;
  });

  afterAll(async () => {
    await prisma.moderationAction.deleteMany({ where: { adminId } });
    await prisma.adminUser.delete({ where: { id: adminId } });
    await app.close();
  });

  it('login correcto devuelve un JWT y los datos públicos del admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(HttpStatus.OK);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.admin).toMatchObject({ id: adminId, email: ADMIN_EMAIL });
    expect(response.body.admin).not.toHaveProperty('passwordHash');
  });

  it('login con password incorrecta devuelve 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: 'contraseña-incorrecta' })
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('login con email inexistente devuelve 401 (mismo mensaje, sin filtrar si el correo existe)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'no-existe@example.com', password: ADMIN_PASSWORD })
      .expect(HttpStatus.UNAUTHORIZED);

    expect(response.body.message).toBe('Correo o contraseña incorrectos');
  });
});
