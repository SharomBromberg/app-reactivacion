import 'reflect-metadata';
import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import type { DamageLevel, Sector, Zone } from '@prisma/client';
import { CreateBusinessDto } from '../src/businesses/dto/create-business.dto';
import { parseCsv, csvRowsToRecords, toCsv } from './seed-lib/csv';

/**
 * Carga masiva inicial de negocios desde data/seed/businesses.csv.
 * Reutiliza CreateBusinessDto (mismas reglas que el endpoint público) para
 * que una fila que no pasaría el formulario tampoco entre por el seed.
 * Uso: pnpm seed          (inserta)
 *      pnpm seed:dry      (solo reporta, no escribe en la BD)
 */

const DATA_DIR = path.join(__dirname, '../../../data/seed');
const INPUT_PATH = path.join(DATA_DIR, 'businesses.csv');
const ERRORS_PATH = path.join(DATA_DIR, 'errors.csv');
const REQUIRED_COLUMNS = ['name', 'zone', 'sector', 'damageLevel', 'phone', 'description'];

interface ErrorRow {
  fila: number;
  name: string;
  zone: string;
  sector: string;
  damageLevel: string;
  phone: string;
  description: string;
  motivo: string;
}

interface ValidRow {
  name: string;
  zone: Zone;
  sector: Sector;
  damageLevel: DamageLevel;
  phone: string;
  description: string;
}

/** Normaliza a E.164 colombiano (+57 + 10 dígitos). Devuelve null si no se puede. */
function normalizePhoneCo(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');

  if (raw.trim().startsWith('+57') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('57')) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+57${digits}`;
  }
  return null;
}

function errorRow(fila: number, record: Record<string, string>, motivo: string): ErrorRow {
  return {
    fila,
    name: record.name ?? '',
    zone: record.zone ?? '',
    sector: record.sector ?? '',
    damageLevel: record.damageLevel ?? '',
    phone: record.phone ?? '',
    description: record.description ?? '',
    motivo,
  };
}

async function main(): Promise<void> {
  const isDry = process.argv.includes('--dry');

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`No se encontró ${INPUT_PATH}.`);
    console.error('Copia data/seed/businesses.template.csv a businesses.csv y llénalo primero.');
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT_PATH, 'utf-8');
  const records = csvRowsToRecords(parseCsv(raw));

  if (records.length === 0) {
    console.log('businesses.csv no tiene filas de datos. Nada que hacer.');
    return;
  }

  const missingColumns = REQUIRED_COLUMNS.filter((col) => !(col in records[0]));
  if (missingColumns.length > 0) {
    console.error(`Encabezado inválido. Faltan columnas: ${missingColumns.join(', ')}`);
    process.exit(1);
  }

  const errors: ErrorRow[] = [];
  const validRows: ValidRow[] = [];
  const phonesSeenInFile = new Map<string, number>(); // teléfono normalizado -> fila

  const prisma = new PrismaClient();
  let existingPhones = new Set<string>();
  try {
    const existing = await prisma.business.findMany({ select: { phone: true } });
    existingPhones = new Set(existing.map((b) => b.phone));
  } catch (error) {
    console.error('No se pudo consultar la base de datos para revisar duplicados existentes.');
    console.error(error);
    process.exit(1);
  }

  records.forEach((record, index) => {
    const fila = index + 2; // fila 1 es el encabezado

    const normalizedPhone = normalizePhoneCo(record.phone ?? '');

    const candidate = plainToInstance(CreateBusinessDto, {
      name: record.name,
      zone: record.zone,
      sector: record.sector,
      damageLevel: record.damageLevel,
      phone: normalizedPhone ?? record.phone,
      description: record.description || undefined,
    });

    const violations = validateSync(candidate, { whitelist: true, forbidUnknownValues: false });

    if (violations.length > 0) {
      const motivo = violations
        .flatMap((v) => Object.values(v.constraints ?? {}))
        .join('; ');
      errors.push(errorRow(fila, record, motivo || 'dato inválido'));
      return;
    }

    const phone = candidate.phone;

    if (existingPhones.has(phone)) {
      errors.push(errorRow(fila, record, `teléfono ya registrado en la base de datos (${phone})`));
      return;
    }

    if (phonesSeenInFile.has(phone)) {
      const primeraFila = phonesSeenInFile.get(phone);
      errors.push(errorRow(fila, record, `teléfono duplicado en el archivo (ya aparece en fila ${primeraFila})`));
      return;
    }

    phonesSeenInFile.set(phone, fila);
    validRows.push({
      name: candidate.name,
      zone: candidate.zone,
      sector: candidate.sector,
      damageLevel: candidate.damageLevel,
      phone: candidate.phone,
      description: candidate.description ?? '',
    });
  });

  if (errors.length > 0) {
    const header = ['fila', 'name', 'zone', 'sector', 'damageLevel', 'phone', 'description', 'motivo'];
    const rows = errors.map((e) => [
      String(e.fila),
      e.name,
      e.zone,
      e.sector,
      e.damageLevel,
      e.phone,
      e.description,
      e.motivo,
    ]);
    fs.writeFileSync(ERRORS_PATH, toCsv(header, rows), 'utf-8');
  } else if (fs.existsSync(ERRORS_PATH)) {
    fs.unlinkSync(ERRORS_PATH);
  }

  console.log(`Filas leídas:    ${records.length}`);
  console.log(`Válidas:         ${validRows.length}`);
  console.log(`Con errores:     ${errors.length}${errors.length > 0 ? ` (ver ${path.relative(process.cwd(), ERRORS_PATH)})` : ''}`);

  if (isDry) {
    console.log('\nModo --dry: no se escribió nada en la base de datos.');
    await prisma.$disconnect();
    return;
  }

  if (validRows.length > 0) {
    const result = await prisma.business.createMany({
      data: validRows.map((row) => ({
        name: row.name,
        zone: row.zone,
        sector: row.sector,
        damageLevel: row.damageLevel,
        phone: row.phone,
        description: row.description || null,
        source: 'SEED',
      })),
    });
    console.log(`Insertadas:      ${result.count} (source=SEED)`);
  }

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
