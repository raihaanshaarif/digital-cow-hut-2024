import { IPaginationOptions } from '../interfaces/paination';

export const paginationFields: (keyof IPaginationOptions)[] = [
  'page',
  'limit',
  'sortBy',
  'sortOrder',
];
