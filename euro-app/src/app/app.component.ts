import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Match } from './models/match.model';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import firebase from 'firebase/app';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations';
import { User } from './models/user.model';
import { RouteRulesService } from './services/route-rules.service';
import { PwaService } from './services/pwa.service';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation],
})
export class AppComponent implements OnInit {
  user$!: Observable<User | null>;
  hasRequired$!: Observable<boolean>;
  isUpdating$!: Observable<string>;

  constructor(
    private authService: AuthService,
    private pwa: PwaService,
    private routeRulesService: RouteRulesService, 
    private updates: AppUpdateService
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.currentUser$;
    this.hasRequired$ = this.routeRulesService.required$.pipe(
      map((required) => required !== null)
    );

    this.isUpdating$ = this.updates.isCheckingUpdates$;
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationOrder']
    );
  }

  async logout() {
    await this.authService.logout();
  }

  deferredPrompt: any;
  showInstallButton: boolean = false;

  // PWA support
  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompot(e: any) {
    e.preventDefault();
    this.pwa.onBeforeInstallPrompt(e);
  }

  @HostListener('window:appinstalled')
  onAppInstalled() {
    this.pwa.onAppInstalled();
  }

  @HostListener('scroll', ['$event'])
  onScroll(e: any) {
    e.preventDefault();
    window.scrollTo(0, 0);
  }
}
