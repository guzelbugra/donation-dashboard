import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ColumnDef } from '../../models/table.model';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericTableComponent<T> {
  @Input({ required: false }) title: undefined | string = undefined;
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];
  @Input({ required: true }) page = 1;
  @Input({ required: true }) totalPages = 1;
  @Input({ required: true }) total = 0;
  @Input({ required: true }) sort = '';
  @Input({ required: true }) order: 'asc' | 'desc' = 'desc';
  @Input({ required: true }) limit = 10;
  @Input({ required: false }) loading = false;
  @Input() error: string | null = null;
  @Output() retry = new EventEmitter<void>();

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<string>();

  getCellValue(row: T, col: ColumnDef<T>): string | number {
    if (col.cell) {
      return col.cell(row);
    }
    const val = row[col.key as keyof T];
    return val !== undefined && val !== null ? String(val) : '';
  }

  get startItem(): number {
    if (this.total === 0) return 0;
    return (this.page - 1) * this.limit + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.limit, this.total);
  }

  onSort(col: ColumnDef<T>): void {
    if (col.sortable) {
      this.sortChange.emit(String(col.key));
    }
  }
}
