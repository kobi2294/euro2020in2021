import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { filterNotUndefined } from '../tools/is-not-null';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentFirebaseUser$!: Observable<firebase.User | null>;
  currentUser$!: Observable<User | null>;
  isLoggedIn$!: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.currentFirebaseUser$ = this.afAuth.user;

    this.currentUser$ = this.currentFirebaseUser$.pipe(
      switchMap(user => (user && user.email) 
                    ? db.doc<User>(`users/${user.email}`).valueChanges()
                    : of(null)), 
      filterNotUndefined(), 
      startWith(null), 
      shareReplay(1)
    );

    this.isLoggedIn$ = this.currentUser$.pipe(
      map(user => user !== null)
    );
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

  async authLogin(provider: firebase.auth.AuthProvider): Promise<firebase.auth.UserCredential> {
    await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return await this.afAuth.signInWithPopup(provider);
  }
}
