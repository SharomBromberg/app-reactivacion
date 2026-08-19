import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';
import { sanitizeText } from '../../common/utils/sanitize-text.util';

export class CreateProductDto {
  @IsString()
  businessId!: string;

  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(2, 80)
  name!: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(0, 300)
  description?: string;

  /** Honeypot anti-spam: debe llegar vacío. */
  @IsOptional()
  website?: string;
}
