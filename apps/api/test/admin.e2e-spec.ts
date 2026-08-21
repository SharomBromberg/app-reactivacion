import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as argon2 from 'argon2';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

jest.setTimeout(30_000);

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const TEST_RUN_ID = `e2e-admin-${Date.now()}`;
  const ADMIN_EMAIL = `${TEST_RUN_ID}@example.com`;
  const ADMIN_PASSWORD = 'correct-horse-battery-staple';
  let adminId: string;
  let accessToken: string;
  const createdBusinessIds: string[] = [];

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

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(HttpStatus.OK);
    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    if (createdBusinessIds.length > 0) {
      await prisma.business.deleteMany({ where: { id: { in: createdBusinessIds } } });
    }
    await prisma.moderationAction.deleteMany({ where: { adminId } });
    await prisma.adminUser.delete({ where: { id: adminId } });
    await app.close();
  });

  it('GET /admin/queue sin token devuelve 401', async () => {
    await request(app.getHttpServer()).get('/admin/queue').expect(HttpStatus.UNAUTHORIZED);
  });

  it('GET /admin/actions sin token devuelve 401', async () => {
    await request(app.getHttpServer()).get('/admin/actions').expect(HttpStatus.UNAUTHORIZED);
  });

  it('PATCH /admin/businesses/:id/hide sin token devuelve 401', async () => {
    await request(app.getHttpServer())
      .patch('/admin/businesses/cualquier-id/hide')
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('hide oculta el negocio de la ruta pública y queda registrado en ModerationAction', async () => {
    const created = await request(app.getHttpServer())
      .post('/businesses')
      .send({
        name: `${TEST_RUN_ID}-negocio`,
        zone: 'CUMANDAY',
        sector: 'ALIMENTOS_RESTAURANTES',
        damageLevel: 'AFECTACION_LEVE',
        phone: '+573001234567',
      })
      .expect(HttpStatus.CREATED);
    const businessId = created.body.id;
    createdBusinessIds.push(businessId);

    await request(app.getHttpServer())
      .get(`/businesses/${businessId}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .patch(`/admin/businesses/${businessId}/hide`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/businesses/${businessId}`)
      .expect(HttpStatus.NOT_FOUND);

    const action = await prisma.moderationAction.findFirst({
      where: { targetId: businessId, action: 'SOFT_DELETE' },
    });
    expect(action).not.toBeNull();
    expect(action?.adminId).toBe(adminId);

    const restoreResponse = await request(app.getHttpServer())
      .patch(`/admin/businesses/${businessId}/restore`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);
    expect(restoreResponse.body.deletedAt).toBeNull();

    await request(app.getHttpServer())
      .get(`/businesses/${businessId}`)
      .expect(HttpStatus.OK);
  });

  it('ban exige nota y bloquea el negocio de la ruta pública', async () => {
    const created = await request(app.getHttpServer())
      .post('/businesses')
      .send({
        name: `${TEST_RUN_ID}-negocio-ban`,
        zone: 'TESORITO',
        sector: 'TECNOLOGIA_DIGITAL',
        damageLevel: 'SIN_AFECTACION',
        phone: '+573007654321',
      })
      .expect(HttpStatus.CREATED);
    const businessId = created.body.id;
    createdBusinessIds.push(businessId);

    await request(app.getHttpServer())
      .patch(`/admin/businesses/${businessId}/ban`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(HttpStatus.BAD_REQUEST);

    await request(app.getHttpServer())
      .patch(`/admin/businesses/${businessId}/ban`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ note: 'Reincidente con spam en la descripción' })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .get(`/businesses/${businessId}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('GET /admin/queue y /admin/actions responden con token válido', async () => {
    await request(app.getHttpServer())
      .get('/admin/queue')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    const actionsResponse = await request(app.getHttpServer())
      .get('/admin/actions')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(actionsResponse.body.items.length).toBeGreaterThan(0);
    expect(actionsResponse.body.items[0].admin).toMatchObject({ id: adminId, email: ADMIN_EMAIL });
  });
});
