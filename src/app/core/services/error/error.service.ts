import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private _error: WritableSignal<Error> = signal<Error>({
    show: false,
    message: '',
  });
  error = this._error.asReadonly();

  setError(message: string) {
    this._error.update((error) => {
      error.show = true;
      error.message = message;
      return error;
    });
  }

  dismissError() {
    this._error.update((error) => {
      error.show = false;
      error.message = '';
      return error;
    });
  }
}

interface Error {
  show: boolean;
  message: string;
}
