import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Estos tests corren contra el DATABASE_URL configurado en .env (Supabase
 * real, no hay Postgres local de test todavía). Por eso cada caso marca sus
 * registros con un prefijo único (TEST_RUN_ID) y los borra en afterAll.
 */
describe('BusinessesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const TEST_RUN_ID = `e2e-${Date.now()}`;
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
  });

  afterAll(async () => {
    if (createdBusinessIds.length > 0) {
      await prisma.business.deleteMany({ where: { id: { in: createdBusinessIds } } });
    }
    await app.close();
  });

  it('registra un negocio válido y no expone moderationNote', async () => {
    const response = await request(app.getHttpServer())
      .post('/businesses')
      .send({
        name: `${TEST_RUN_ID}-negocio-valido`,
        zone: 'CUMANDAY',
        sector: 'ALIMENTOS_RESTAURANTES',
        damageLevel: 'AFECTACION_LEVE',
        phone: '+573001234567',
        description: 'Panadería de barrio',
      })
      .expect(HttpStatus.CREATED);

    expect(response.body).toMatchObject({
      name: `${TEST_RUN_ID}-negocio-valido`,
      zone: 'CUMANDAY',
    });
    expect(response.body).not.toHaveProperty('moderationNote');
    expect(response.body.id).toEqual(expect.any(String));

    createdBusinessIds.push(response.body.id);
  });

  it('descarta silenciosamente un registro con honeypot lleno', async () => {
    const response = await request(app.getHttpServer())
      .post('/businesses')
      .send({
        name: `${TEST_RUN_ID}-bot`,
        zone: 'CUMANDAY',
        sector: 'ALIMENTOS_RESTAURANTES',
        damageLevel: 'AFECTACION_LEVE',
        phone: '+573001234567',
        website: 'http://spam.example.com',
      })
      .expect(HttpStatus.OK);

    expect(response.body).not.toHaveProperty('id');

    const saved = await prisma.business.findFirst({
      where: { name: `${TEST_RUN_ID}-bot` },
    });
    expect(saved).toBeNull();
  });

  it('filtra la lista pública por zona', async () => {
    const created = await request(app.getHttpServer())
      .post('/businesses')
      .send({
        name: `${TEST_RUN_ID}-zona-tesorito`,
        zone: 'TESORITO',
        sector: 'TECNOLOGIA_DIGITAL',
        damageLevel: 'SIN_AFECTACION',
        phone: '+573007654321',
      })
      .expect(HttpStatus.CREATED);
    createdBusinessIds.push(created.body.id);

    const response = await request(app.getHttpServer())
      .get('/businesses')
      .query({ zone: 'TESORITO', search: TEST_RUN_ID })
      .expect(HttpStatus.OK);

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].id).toBe(created.body.id);
    expect(response.body.items[0].zone).toBe('TESORITO');
  });

  it('excluye negocios con deletedAt de la lista pública', async () => {
    const created = await request(app.getHttpServer())
      .post('/businesses')
      .send({
        name: `${TEST_RUN_ID}-eliminado`,
        zone: 'PALOGRANDE',
        sector: 'SALUD_BIENESTAR',
        damageLevel: 'AFECTACION_MODERADA',
        phone: '+573009998877',
      })
      .expect(HttpStatus.CREATED);
    createdBusinessIds.push(created.body.id);

    await prisma.business.update({
      where: { id: created.body.id },
      data: { deletedAt: new Date() },
    });

    const listResponse = await request(app.getHttpServer())
      .get('/businesses')
      .query({ search: TEST_RUN_ID, zone: 'PALOGRANDE' })
      .expect(HttpStatus.OK);
    expect(listResponse.body.items).toHaveLength(0);

    await request(app.getHttpServer())
      .get(`/businesses/${created.body.id}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
