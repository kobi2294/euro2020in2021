import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
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
  readonly myMatchRecords$!: Observable<MatchRecord[]>;
  readonly allMatches$!: Observable<Match[]>;
  readonly allScores$!: Observable<Score[]>;
  readonly allUsers$!: Observable<User[]>;
  readonly allStages$!: Observable<Stage[]>;
  readonly pointsInBank$!: Observable<number>;
  readonly allGroups$!: Observable<Group[]>;

  constructor(
    private db: AngularFirestore,
    private auth: AuthService, 
    private api: ApiService
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

    this.allScores$ = this.db.collection<Score>('scores').valueChanges().pipe(
      shareReplay(1)
    );

    this.allUsers$ = this.db.collection<User>('users').valueChanges().pipe(
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
    return matches
      .map<MatchRecord>(match => ({
        match: match,
        date: new Date(match.date),
        guess: guesses[match.id]
      }))
      .sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  async ensureGroup(groupId: string) {
    console.log('ensure group', groupId);
    let user = await this.auth.currentUser$.pipe(
      filterNotNull(),
      take(1))
      .toPromise();
    console.log('user', user); 

    let allGroups = await this.allGroups$.pipe(take(1)).toPromise();
    console.log('all groups', allGroups);
    let group = allGroups.find(g => g.id === groupId);
    console.log('group', group);

    if (!user || !group) return;    
    if (user.groups?.includes(groupId)) return;

    const groups = [...(user.groups ?? []), groupId];

    user = {
      ...user, 
      groups
    }

    console.log('updating user');

    await this.api.updateUser(user);
  }



}
