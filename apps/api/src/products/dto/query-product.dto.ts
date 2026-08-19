import { IsString } from 'class-validator';
import { CursorPaginationQueryDto } from '../../common/dto/cursor-pagination-query.dto';

export class QueryProductDto extends CursorPaginationQueryDto {
  @IsString()
  businessId!: string;
}
