import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, interval, Observable, timer } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { Group } from '../models/group.model';
import { Guess } from '../models/guess.model';
import { MatchRecord } from '../models/match-record';
import { Match } from '../models/match.model';
import { Score } from '../models/score.model';
import { Stage } from '../models/stage.model';
import { User } from '../models/user.model';
import { sum } from '../tools/aggregations';
import { filterNotNull } from '../tools/is-not-null';
import { NumberMapping, toNumberMapping } from '../tools/mappings';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  readonly myNextGuesses$!: Observable<MatchRecord[]>;
  readonly allMatches$!: Observable<Match[]>;

  readonly recentMatches$!: Observable<Match[]>;
  readonly comingUpMatches$!: Observable<Match[]>;

  readonly allUserGuesses$: Observable<NumberMapping<Guess>>;
  readonly allScores$!: Observable<Score[]>;
  readonly allStages$!: Observable<Stage[]>;
  readonly pointsInBank$!: Observable<number>;
  readonly allGroups$!: Observable<Group[]>;

  constructor(
    private db: AngularFirestore,
    private auth: AuthService, 
    private api: ApiService
  ) {
    this.allUserGuesses$ = this.auth.currentUser$.pipe(
      filterNotNull(),
      switchMap(user => this.db.collection('users').doc(user.email).collection<Guess>('guesses').valueChanges()), 
      map(guesses => toNumberMapping(guesses, guess => guess.matchId))
    );

    this.allMatches$ = this.db.collection<Match>('matches').valueChanges()
      .pipe(
        debounceTime(100),
        shareReplay(1)
      );

    this.comingUpMatches$ = combineLatest([timer(0, 60000), this.allMatches$]) .pipe(
        map(([_, all]) => this.nextMatches(all)), 
        shareReplay(1)
      );

    this.recentMatches$ = combineLatest([timer(0, 60000), this.allMatches$]) .pipe(
        map(([_, all]) => this.recentMatches(all)), 
        shareReplay(1)
      );

    this.myNextGuesses$ = combineLatest([timer(0, 60000), this.allMatches$, this.allUserGuesses$]).pipe(
      map(([_, matches, guesses]) => this.createRecords(matches, guesses)), 
      shareReplay(1)
    );

    this.allScores$ = this.db.collection<Score>('scores').valueChanges().pipe(
      shareReplay(1)
    );

    this.allGroups$ = this.db.collection<Group>('groups').valueChanges().pipe(
      shareReplay(1)
    );

    this.allStages$ = this.db.collection<Stage>('stages').valueChanges().pipe(
      shareReplay(1)
    );

    this.pointsInBank$ = combineLatest([this.allMatches$, this.allStages$]).pipe(
      map(([matches, stages]) => sum(matches
        .filter(m => new Date(m.date).valueOf() > Date.now().valueOf())
        .map(m => this.stageOf(m, stages)), item => item?.points??0))
    );

  }

  private stageOf(match: Match, stages: Stage[]): Stage | undefined{
    return stages.find(s => (s.displayName === (match.stage ?? ''))
                        || (s.names && s.names.includes(match.stage??'')));
  }


  private createRecords(matches: Match[], guesses: NumberMapping<Guess>): MatchRecord[] {
    let now = Date.now().valueOf();

    return matches
      .map<MatchRecord>(match => ({
        match: match,
        date: new Date(match.date),
        guess: guesses[match.id]
      }))
      .filter(record => record.date.valueOf() > now)
      .filter(record => record.match.home && record.match.away)
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  private nextMatches(allMatches: Match[]): Match[] {
    const now = Date.now().valueOf();
    const futureMatches = allMatches
      .filter(m => new Date(m.date).valueOf() > now)
      .filter(m => m.away && m.home)
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

      if (futureMatches.length === 0) return [];

      const res = futureMatches.filter(m => m.date === futureMatches[0].date);
      return res;
  }

  private recentMatches(allMatches: Match[]): Match[] {
    const now = Date.now().valueOf();

    const pastMatches = allMatches
      .filter(m => new Date(m.date).valueOf() <= now)
      .filter(m => m.away && m.home)
      .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
    
    if (pastMatches.length === 0) return [];

    const res = pastMatches.filter(m => m.date === pastMatches[0].date);
    return res;
  }

  async ensureGroup(groupId: string) {
    let user = await this.auth.currentUser$.pipe(
      filterNotNull(),
      take(1))
      .toPromise();

    let allGroups = await this.allGroups$.pipe(take(1)).toPromise();
    let group = allGroups.find(g => g.id === groupId);

    if (!user || !group) return;    
    if (user.groups?.includes(groupId)) return;

    const groups = [...(user.groups ?? []), groupId];

    user = {
      ...user, 
      groups
    }

    await this.api.updateUser(user);
  }





}
