import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ORDERS } from '../data/ecommerce/orderhistory';

export type SortColumn = keyof ORDERS | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  standalone:true,
  selector: 'th[sortableOrder]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class OrderdataTableDirective {

  constructor() { }
  @Input() sortableOrder: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortableOrder, direction: this.direction });
  }

}
