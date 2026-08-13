export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  cell?: (row: T) => string | number;
}
