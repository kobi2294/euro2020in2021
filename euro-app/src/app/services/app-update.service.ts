import { ApplicationRef, Injectable, Injector } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, timer } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {  
  readonly ver = 5;

  private _isCheckingUpdates$ = new BehaviorSubject('!');
  public isCheckingUpdates$ = this._isCheckingUpdates$.asObservable();

  constructor(
    private updates: SwUpdate, 
    ) { }

  init() {
    if (!this.updates.isEnabled) return;

    console.log('automatic updates enabled (1.5)');

    this.updates.available.subscribe(async ev => {
      console.log('updating version');
      await this.updates.activateUpdate();
      document.location.reload();

    });

    this.updates.unrecoverable.subscribe(async ev => {
      await this.updates.activateUpdate();
      document.location.reload();
    });

    timer(90000, 5 * 60 * 1000).subscribe(async () => {
      try {
        this._isCheckingUpdates$.next('!!');
        console.log('checking for update');
        await this.updates.checkForUpdate();
        console.log('checking completed');
      } catch (err) {
        console.log('error checking for update', err);
      } finally {
        this._isCheckingUpdates$.next('!!!');
      } 
    });

}
}
