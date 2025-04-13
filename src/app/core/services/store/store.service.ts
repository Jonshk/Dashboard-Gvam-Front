import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor() {}

  save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any | null {
    const value = localStorage.getItem(key);
    if (value == null) {
      return null;
    }

    return JSON.parse(value);
  }

  clear() {
    localStorage.clear();
  }
}
