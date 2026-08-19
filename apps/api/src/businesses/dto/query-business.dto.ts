import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Sector, Zone } from '@prisma/client';
import { CursorPaginationQueryDto } from '../../common/dto/cursor-pagination-query.dto';

export class QueryBusinessDto extends CursorPaginationQueryDto {
  @IsOptional()
  @IsEnum(Zone)
  zone?: Zone;

  @IsOptional()
  @IsEnum(Sector)
  sector?: Sector;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  search?: string;
}
