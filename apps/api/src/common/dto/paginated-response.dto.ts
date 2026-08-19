export interface PaginatedResponseDto<T> {
  items: T[];
  nextCursor: string | null;
}
