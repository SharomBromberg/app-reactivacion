import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { sanitizeText } from '../../common/utils/sanitize-text.util';

export class BanDto {
  /** Nota obligatoria: por qué se banea (queda en ModerationAction.note). */
  @Transform(({ value }) => (typeof value === 'string' ? sanitizeText(value) : value))
  @IsString()
  @Length(3, 300)
  note!: string;
}
