import { Injectable } from '@angular/core';
import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { User } from '../models/user.model';
import { filterNotNull } from '../tools/is-not-null';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteRulesService {
  route$!: Observable<string>;
  required$!: Observable<UrlTree | null>;
  forbidden$!: Observable<UrlTree[]>;
  targetUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.route$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd),
      map(event => event.url)
    );

    this.required$ = combineLatest([this.route$, this.authService.currentUser$]).pipe(
      map(([route, user]) => this.calcRequiredRoute(route, user))
    );

    this.forbidden$ = this.authService.currentUser$.pipe(
      map(user => this.calcForbiddenRoutes(user))
    );
  }

  async init(): Promise<void> {
    combineLatest([this.required$, this.forbidden$, this.route$])
    .subscribe(([required, forbidden, current]) => {
      this.handleEnforcedRoute(required, forbidden, current);
    });
  }

  private calcRequiredRoute(url: string, user: User | null): UrlTree | null {
    if (url === '/legal') return null;
    if (url === '/privacy') return null;

    if (user === null) return this.router.createUrlTree(['login']);
    if ((!user.groups) || (user.groups.length == 0)) return this.router.createUrlTree(['profile']);

    return null;
  }

  private calcForbiddenRoutes(user: User | null): UrlTree[] {
    let res: UrlTree[] = [];

    if (user !== null) res.push(this.router.createUrlTree(['login']));

    return res;
  }

  private handleEnforcedRoute(required: UrlTree | null, forbidden: UrlTree[], currentRoute: string) {
    if (required !== null) {
      if (required.toString() === currentRoute) return;

      if (this.targetUrl === null) {
        this.targetUrl = currentRoute;  
      }
      this.router.navigateByUrl(required);
      return;
    }

    let forbiddenUrls = forbidden.map(urlTree => urlTree.toString());

    // if we got here, required is null.
    // if there is an old target, its time to use it
    let targetUrl = this.targetUrl;
    this.targetUrl = null;

    if ((targetUrl !== null) && forbiddenUrls.includes(targetUrl)) 
    {
      targetUrl = null;
    }

    if ((targetUrl !== null) && (currentRoute !== targetUrl)) {
      this.router.navigateByUrl(targetUrl);
    }

    // if we got here, targetUrl == null or it is equal to current route, and in any case may be ignored
    if (forbiddenUrls.includes(currentRoute)) {
      this.router.navigate(['']);
    }
  }
}
