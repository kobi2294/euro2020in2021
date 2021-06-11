import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import firebase from 'firebase/app';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$!: Observable<firebase.User | null>;


  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.currentUser$ = this.afAuth.user;
  }

  async init(): Promise<void> {
    console.log('initializing');

    let route$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd),
      map(event => event.url), 
      tap(url => console.log('route: ', url))
    );

    combineLatest([this.currentUser$, route$])
      .subscribe(([user, url]) => this.handleRoutingLogic(user, url))
  }

  private handleRoutingLogic(user: firebase.User | null, url: string) {
    console.log('handling logic', user, url);

    if ((user === null) && (url !== '/login')) {
      this.router.navigate(['login']);
      return;
    }

    if ((user !== null) && (url === '/login')) {
      this.router.navigate(['home'])
    }
  }

  facebookAuth(): Promise<firebase.auth.UserCredential> {
    return this.authLogin(new firebase.auth.FacebookAuthProvider());
  }

  googleAuth(): Promise<firebase.auth.UserCredential> {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  authLogin(provider: firebase.auth.AuthProvider): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithPopup(provider);
  }


}
