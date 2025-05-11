// src/app/pipes/filter-by.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterBy' })
export class FilterByPipe implements PipeTransform {
  transform<T>(arr: T[], prop: keyof T, term: any): T[] {
    if (!term) return arr;
    return arr.filter(item =>
      ('' + item[prop]).toLowerCase().includes(('' + term).toLowerCase())
    );
  }
}
