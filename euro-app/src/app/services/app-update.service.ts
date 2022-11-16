import { ApplicationRef, Injectable, Injector, NgZone } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval, timer } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {  
  readonly ver = 3;

  constructor(
    private updates: SwUpdate, 
    private ngZone: NgZone, 
    private injector: Injector
    ) { }

  init() {
    if (!this.updates.isEnabled) return;

    const appref = this.injector.get(ApplicationRef);
    const stable$ = appref.isStable
    .pipe(first(val => val === true))
    .toPromise();

    stable$.then(() => {
      this.updates.available.subscribe(async ev => {
        await this.updates.activateUpdate();
        await new Promise(res => setTimeout(res, 5000));
        document.location.reload();

      });

      this.updates.unrecoverable.subscribe(async ev => {
        await this.updates.activateUpdate();
        document.location.reload();
      });

      timer(45000, 20000).subscribe(async () => {
        try {
          await this.updates.checkForUpdate();
        } catch (err) {
        }
      })
    });
  }
}
