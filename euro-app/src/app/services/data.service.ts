import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap } from 'rxjs/operators';
import { Guess } from '../models/guess.model';
import { MatchRecord } from '../models/match-record';
import { Match } from '../models/match.model';
import { filterNotNull } from '../tools/is-not-null';
import { NumberMapping, toNumberMapping } from '../tools/mappings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly myMatchRecords$!: Observable<MatchRecord[]>;
  readonly allMatches$!: Observable<Match[]>;

  constructor(
    private db: AngularFirestore,
    private auth: AuthService
  ) {
    let guesses$ = this.auth.currentUser$.pipe(
      filterNotNull(),
      switchMap(user => this.db.collection('users').doc(user.email).collection<Guess>('guesses').valueChanges()), 
      map(guesses => toNumberMapping(guesses, guess => guess.matchId))
    );

    this.allMatches$ = this.db.collection<Match>('matches').valueChanges()
      .pipe(
        debounceTime(100),
        shareReplay(1)
      );


    this.myMatchRecords$ = combineLatest([this.allMatches$, guesses$]).pipe(
      map(([matches, guesses]) => this.createRecords(matches, guesses)), 
      shareReplay(1)
    );
  }

  private createRecords(matches: Match[], guesses: NumberMapping<Guess>): MatchRecord[] {
    return matches
      .map<MatchRecord>(match => ({
        match: match,
        date: new Date(match.date),
        guess: guesses[match.id]
      }))
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

}
