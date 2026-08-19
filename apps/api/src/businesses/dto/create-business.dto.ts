import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { DamageLevel, Sector, Zone } from '@prisma/client';
import { sanitizeText } from '../../common/utils/sanitize-text.util';

/** Formato E.164 de Colombia, ej. +573001234567 (indicativo +57 + 10 dígitos). */
const PHONE_CO_E164 = /^\+57\d{10}$/;

export class CreateBusinessDto {
  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(3, 80)
  name!: string;

  @IsEnum(Zone)
  zone!: Zone;

  @IsEnum(Sector)
  sector!: Sector;

  @IsEnum(DamageLevel)
  damageLevel!: DamageLevel;

  @Matches(PHONE_CO_E164, {
    message: 'phone debe tener formato E.164 de Colombia, ej. +573001234567',
  })
  phone!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(0, 300)
  description?: string;

  /** Honeypot anti-spam: los formularios reales lo dejan vacío. */
  @IsOptional()
  website?: string;
}
