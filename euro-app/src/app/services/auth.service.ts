import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationEnd, Router } from '@angular/router';
import firebase from 'firebase/app';
import { combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentFirebaseUser$!: Observable<firebase.User | null>;
  currentUser$!: Observable<any | null>;
  isLoggedIn$!: Observable<boolean>;


  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.currentFirebaseUser$ = this.afAuth.user;

    this.currentUser$ = this.currentFirebaseUser$.pipe(
      tap(user => {
        console.log('user = ', user?.email)
      }),
      switchMap(user => (user && user.email) 
                    ? db.doc<User>(`users/${user.email}`).valueChanges()
                    : of(null)), 
      map(user => (user) ?? null)
    );

    this.isLoggedIn$ = this.currentUser$.pipe(
      map(user => user !== null)
    );

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

  private handleRoutingLogic(user: User | null, url: string) {
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
