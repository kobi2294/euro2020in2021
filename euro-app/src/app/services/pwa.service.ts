import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private _showInstall$ = new BehaviorSubject<boolean>(false);
  showInstall$ = this._showInstall$.asObservable();

  private _showIosMessage$ = new BehaviorSubject<boolean>(false);
  showIosMessage$ = this._showIosMessage$.asObservable();

  private deferredPrompt: any = null;

  onBeforeInstallPrompt(e: any) {
    this.deferredPrompt = e;
    this._showInstall$.next(true);
  }

  onAppInstalled() {
    this._showInstall$.next(false);
    this.deferredPrompt = null;
  }

  async install() {
    this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;

    console.log(choice);
    this.deferredPrompt = null;
  }

  init() {
    console.log('testing if in IOS and not standalone');
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = ('standalone' in window.navigator) && ((window.navigator as any).standalone);

    console.log(userAgent);
    console.log(isIos);
    console.log(isStandalone);

    if (isIos && !isStandalone) {
      this._showIosMessage$.next(true);
    }
  }


  constructor() { }
}
