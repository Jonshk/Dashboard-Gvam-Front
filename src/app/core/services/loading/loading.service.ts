import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading: WritableSignal<boolean> = signal(false);
  isLoading = this._isLoading.asReadonly();

  private _showLoading: WritableSignal<boolean> = signal(false);
  showLoading = this._showLoading.asReadonly();

  private timeout: any = null;

  setLoading(delay: number = 500) {
    this._isLoading.set(true);

    this.timeout = setTimeout(() => {
      this._showLoading.set(true);
    }, delay);
  }

  dismissLoading() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = null;

    this._isLoading.set(false);
    this._showLoading.set(false);
  }
}
