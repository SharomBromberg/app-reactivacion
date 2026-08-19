import { IsEnum, IsOptional } from 'class-validator';
import { SupportPostType, Zone } from '@prisma/client';
import { CursorPaginationQueryDto } from '../../common/dto/cursor-pagination-query.dto';

export class QuerySupportPostDto extends CursorPaginationQueryDto {
  @IsOptional()
  @IsEnum(SupportPostType)
  type?: SupportPostType;

  @IsOptional()
  @IsEnum(Zone)
  zone?: Zone;
}
