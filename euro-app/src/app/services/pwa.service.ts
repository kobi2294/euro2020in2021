import { Injectable } from '@angular/core';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private _showMessage$ = new BehaviorSubject<boolean>(false);
  showMessage$ = this._showMessage$.asObservable();

  private deferredPrompt: any = null;

  onBeforeInstallPrompt(e: any) {
    this.deferredPrompt = e;
    this._showMessage$.next(true);
  }

  onAppInstalled() {
    this._showMessage$.next(false);
    this.deferredPrompt = null;
  }

  async install() {
    this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;

    console.log(choice);
    this.deferredPrompt = null;
  }


  constructor() { }
}
