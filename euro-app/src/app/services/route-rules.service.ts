import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, UrlTree } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { User } from '../models/user.model';
import { filterNotNull } from '../tools/is-not-null';
import { isSame } from '../tools/is-same';
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
      filter(event => (event instanceof NavigationStart) || (event instanceof NavigationEnd)),
      map(event => event as NavigationStart | NavigationEnd),
      map(event => (event instanceof NavigationEnd) ? event.urlAfterRedirects : event.url)
    );

    this.required$ = combineLatest([this.route$, this.authService.currentUser$]).pipe(
      map(([route, user]) => this.calcRequiredRoute(route, user))
    );

    this.forbidden$ = this.authService.currentUser$.pipe(
      map(user => this.calcForbiddenRoutes(user))
    );
  }

  async init(): Promise<void> {
    combineLatest([this.required$, this.forbidden$, this.route$]).pipe(
      distinctUntilChanged(isSame)
    )
    .subscribe(([required, forbidden, current]) => {
      this.handleEnforcedRoute(required, forbidden, current);
    });
  }
  
  

  private calcRequiredRoute(url: string, user: User | null): UrlTree | null {
    if (url === '/legal') return null;
    if (url === '/privacy') return null;
    if (url === '/datadel') return null;

    if (user === null) return this.router.createUrlTree(['login']);

    return null;
  }

  private calcForbiddenRoutes(user: User | null): UrlTree[] {
    let res: UrlTree[] = [];

    if (user != null) {
      res.push(this.router.createUrlTree(['login']));

      for (const group of user?.groups??[]) {
        res.push(this.router.createUrlTree(['group', group]));
      }

      const groupsCount = user.groups?.length ?? 0;
      if (groupsCount === 0) {
        res.push(this.router.createUrlTree(['scoreboard']));
        res.push(this.router.createUrlTree(['guesses']));
      }

      if (!user.admin) {
        res.push(this.router.createUrlTree(['admin']));
      }
    }

    return res;
  }

  private handleEnforcedRoute(required: UrlTree | null, forbidden: UrlTree[], currentRoute: string) {
    // console.log('handle enforced route', [required?.toString(), forbidden.map(f => f.toString()), currentRoute]);

    if (required !== null) {
      if (required.toString() === currentRoute) return;

      if (this.targetUrl === null) {
        this.targetUrl = currentRoute;  
      }
      // console.log('navigate to required', [required.toString(), currentRoute, this.targetUrl]);
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
      // console.log('navigate to previous target', targetUrl);
      this.router.navigateByUrl(targetUrl);
    }

    // if we got here, targetUrl == null or it is equal to current route, and in any case may be ignored
    if (forbiddenUrls.some(fu => currentRoute.includes(fu))) 
    {
      // console.log('navigate because forbidden', currentRoute);
      this.router.navigate(['home']);
    }
  }
}


