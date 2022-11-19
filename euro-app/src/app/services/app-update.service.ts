import { ApplicationRef, Injectable, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, combineLatest, timer } from 'rxjs';
import { filter, first, shareReplay } from 'rxjs/operators';
import { Audit } from '../models/audit.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { PwaService } from './pwa.service';

@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  readonly ver = 5;

  private _isCheckingUpdates$ = new BehaviorSubject('!');
  public isCheckingUpdates$ = this._isCheckingUpdates$.asObservable();

  constructor(
    private updates: SwUpdate,
    private authService: AuthService,
    private pwa: PwaService, 
    private db: AngularFirestore
  ) {}

  init() {
    const user$ = this.authService.currentUser$.pipe(
      filter((u: User | null): u is User => u !== null),
      shareReplay(1)
    );

    console.log('init combine latest');
    combineLatest([
      timer(0, 60 * 60 * 1000),
      user$,
      this.pwa.details$,
    ]).subscribe(async ([_, user, details]) => {
      const audit: Audit = {
        agent: details.agent, 
        standalone: details.standalone, 
        version: details.version, 
        displayName: user.displayName, 
        email: user.email
      };

      await this.db.collection<Audit>('audits').doc(audit.email).set(audit);
    });

    if (!this.updates.isEnabled) return;
    console.log('automatic updates enabled (1.6)');

    this.updates.available.subscribe(async (ev) => {
      console.log('updating version');
      await this.updates.activateUpdate();
      document.location.reload();
    });

    this.updates.unrecoverable.subscribe(async (ev) => {
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
