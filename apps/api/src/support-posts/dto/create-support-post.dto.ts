import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { Sector, SupportPostType, Zone } from '@prisma/client';
import { sanitizeText } from '../../common/utils/sanitize-text.util';

/** Formato E.164 de Colombia, ej. +573001234567 (indicativo +57 + 10 dígitos). */
const PHONE_CO_E164 = /^\+57\d{10}$/;

export class CreateSupportPostDto {
  @IsEnum(SupportPostType)
  type!: SupportPostType;

  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(3, 80)
  title!: string;

  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(3, 300)
  description!: string;

  @IsEnum(Zone)
  zone!: Zone;

  @IsOptional()
  @IsEnum(Sector)
  sector?: Sector;

  @Matches(PHONE_CO_E164, {
    message: 'phone debe tener formato E.164 de Colombia, ej. +573001234567',
  })
  phone!: string;

  @IsOptional()
  @IsString()
  businessId?: string;

  /** Honeypot anti-spam: los formularios reales lo dejan vacío. */
  @IsOptional()
  website?: string;
}
