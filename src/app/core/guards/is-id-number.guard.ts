import { CanMatchFn } from '@angular/router';

export function isIdNumberGuard(idSegment: number): CanMatchFn {
  return (route, segments) => {
    const id = segments[idSegment];
    return !isNaN(Number(id));
  };
}
