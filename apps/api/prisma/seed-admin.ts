import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

/**
 * Siembra o actualiza el moderador inicial desde variables de entorno.
 * No hay registro público de admins: esta es la única forma de crear una
 * cuenta. Se corre a mano una vez por entorno (pnpm seed:admin).
 */
async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Moderador';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL y ADMIN_PASSWORD son requeridas para sembrar el admin inicial');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD debe tener al menos 8 caracteres');
  }

  const prisma = new PrismaClient();

  try {
    const passwordHash = await argon2.hash(password);

    const admin = await prisma.adminUser.upsert({
      where: { email },
      update: { passwordHash, name },
      create: { email, passwordHash, name },
    });

    console.log(`Admin sembrado/actualizado: ${admin.email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
