import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { filterNotUndefined } from '../tools/is-not-null';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _progressMessage$ = new BehaviorSubject<string>('');
  readonly progressMessage$ = this._progressMessage$.asObservable();
  
  private _errorState$ = new BehaviorSubject<string>('');
  readonly errorState$ = this._errorState$.asObservable();

  currentFirebaseUser$!: Observable<firebase.User | null>;
  currentUser$!: Observable<User | null>;
  isLoggedIn$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  isSuper$!: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router, 
    private api: ApiService
  ) {


    this.currentFirebaseUser$ = this.afAuth.user.pipe(
    );

    this.currentUser$ = this.currentFirebaseUser$.pipe(
      switchMap(user => (user && user.email) 
                    ? db.doc<User>(`users/${user.email}`).valueChanges()
                    : of(null)), 
      filterNotUndefined(), 
      map(user => this.fixPhoto(user)),
      startWith(null), 
      shareReplay(1), 
    );

    this.isLoggedIn$ = this.currentUser$.pipe(
      map(user => user !== null)
    );

    this.isAdmin$ = this.currentUser$.pipe(
      map(user => Boolean(user?.admin) || Boolean(user?.super))
    );

    this.isSuper$ = this.currentUser$.pipe(
      map(user => Boolean(user?.super))
    );
  }

  fixPhoto(user: User | null): User | null {
    if (!user) return user;
    if (user.photoUrl) return user;

    return {
      ...user, 
      photoUrl: 'assets/guest.png'
    }
  }

  async facebookAuth(): Promise<void> {
    await this.authLogin('Facebook', () => new firebase.auth.FacebookAuthProvider());
  }

  async googleAuth(): Promise<void> {
    await this.authLogin('Google (Gmail)', () => new firebase.auth.GoogleAuthProvider());
  }

  async twitterAuth(): Promise<void> {
    await this.authLogin('Twitter', () => new firebase.auth.TwitterAuthProvider());
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  async authLogin(label: string, provider :() => firebase.auth.AuthProvider): Promise<void> {
    if (this._progressMessage$.value !== '') return;

    try {
      this._progressMessage$.next(`Authentication with ${label}`);
      this._errorState$.next('');
      await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      await this.afAuth.signInWithRedirect(provider());  
    } catch(err) {
      this._errorState$.next(String(err));
    } finally {
      this._progressMessage$.next('');
    }
  }

  async getRedirectResult() {
    let res: firebase.auth.UserCredential| null = null;
    try {
      res = await this.afAuth.getRedirectResult();
    } catch (err) {
      this._errorState$.next(String(err));
    }

    return res;
  }

}
