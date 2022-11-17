import { ApplicationRef, Injectable, Injector } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {  
  readonly ver = 5;

  constructor(
    private updates: SwUpdate, 
    ) { }

  init() {
    if (!this.updates.isEnabled) return;

    console.log('automatic updates enabled (1.4)');

    this.updates.available.subscribe(async ev => {
      console.log('updating version');
      await this.updates.activateUpdate();
      document.location.reload();

    });

    this.updates.unrecoverable.subscribe(async ev => {
      await this.updates.activateUpdate();
      document.location.reload();
    });

    timer(90000, 10 * 60 * 1000).subscribe(async () => {
      try {
        console.log('checking for update');
        await this.updates.checkForUpdate();
        console.log('checking completed');
      } catch (err) {
        console.log('error checking for update', err);
      }
    });

}
}
