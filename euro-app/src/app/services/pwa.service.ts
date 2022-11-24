import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, ReplaySubject, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PwaDetails {
  standalone: boolean;
  displayModeStandalone: boolean;
  agent: string;
  version: string;  
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private _showInstall$ = new BehaviorSubject<boolean>(false);
  showInstall$ = this._showInstall$.asObservable();

  private _showIosMessage$ = new BehaviorSubject<boolean>(false);
  showIosMessage$ = this._showIosMessage$.asObservable();

  private _details$ = new ReplaySubject<PwaDetails>(1);
  details$ = this._details$.asObservable();

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

    this.deferredPrompt = null;
  }

  init() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = ('standalone' in window.navigator) && ((window.navigator as any).standalone);
    const displayModeStandalone = window?.matchMedia('(display-mode: standalone)')?.matches ?? false;

    this._details$.next({
      agent: userAgent, 
      standalone: isStandalone, 
      version: environment.version, 
      displayModeStandalone
    });

    if (isIos && !isStandalone) {
      this._showIosMessage$.next(true);
    }
  }


  constructor() { }
}
