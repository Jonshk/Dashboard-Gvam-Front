import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter', standalone: true })
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], term: string, field: keyof T): T[] {
    if (!term) return items;
    const lower = term.toLowerCase();
    return items.filter(it => {
      const v = (it[field] as any)?.toString().toLowerCase() || '';
      return v.includes(lower);
    });
  }
}
