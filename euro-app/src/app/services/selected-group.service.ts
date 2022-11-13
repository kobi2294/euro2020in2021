import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { ExtendedScore } from '../models/extended-score.model';
import { ExtendedUserScore } from '../models/extended-user-score.model';
import { Group } from '../models/group.model';
import { GuessScore } from '../models/guess-score.model';
import { Score } from '../models/score.model';
import { UserMatchScore } from '../models/user-match-score.model';
import { UserTableRow } from '../models/user-table-row.model';
import { User } from '../models/user.model';
import { sum } from '../tools/aggregations';
import { groupByString } from '../tools/group-by';
import { StringMapping, toStringMapping } from '../tools/mappings';
import { selectMany } from '../tools/select-many';
import { browseableGroups } from '../tools/user-functions';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedGroupService {
  private userSelection$ = new BehaviorSubject<string>('');
  readonly userGroupIds$!: Observable<string[]>;
  readonly allGroups$!: Observable<StringMapping<Group>>;

  readonly selectedGroup$!: Observable<Group | null>;
  readonly userGroups$!: Observable<Group[]>;

  readonly userHasGroups$!: Observable<boolean>;
  readonly selectedGroupScores$!: Observable<Score[]>;
  readonly selectedGroupExtendedScores$!: Observable<ExtendedScore[]>;
  readonly selectedGroupTable$!: Observable<UserTableRow[]>;
  readonly usersInSelectedGroup$!: Observable<User[]>;

  constructor(
    private auth: AuthService,
    private db: AngularFirestore,
    private data: DataService
  ) {
    this.allGroups$ = this.db.collection<Group>('groups').valueChanges().pipe(
      map(groups => toStringMapping(groups, group => group.id)),
      shareReplay(1)
    );

    this.userGroups$ = combineLatest([this.auth.currentUser$, this.allGroups$]).pipe(
      map(([user, allGroups]) => browseableGroups(user, allGroups))
    );


    this.userGroupIds$ = this.userGroups$.pipe(
      map(groups => (groups??[]).map(g => g.id))
    ); 
    
    let selectedGroupId$ = combineLatest([this.userSelection$, this.userGroupIds$]).pipe(
      map(([userSelection, userGroupIds]) => this.calcEffectiveSelection(userSelection, userGroupIds))
    );

    this.selectedGroup$ = combineLatest([selectedGroupId$, this.allGroups$]).pipe(
      map(([selectedGroupId, allGroups]) => selectedGroupId !== '' ? allGroups[selectedGroupId] : null)
    );


    this.userHasGroups$ = this.userGroups$.pipe(
      map(groups => groups && groups.length > 0)
    )

    this.usersInSelectedGroup$ = this.selectedGroup$.pipe(
      map(group => group?.id??''), 
      switchMap(id => this.db.collection<User>('users', ref => ref.where('groups', 'array-contains', id)).valueChanges())      
    );    

    let mappedUsers$ = this.usersInSelectedGroup$.pipe(
      map(users => toStringMapping(users, user => user.email)),
    );

    let allScores$ = this.data.allScores$.pipe(
      map(scores => scores.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()))
    );

    // now we need to reduce it to only the players in the current group
    this.selectedGroupScores$ = combineLatest([allScores$, this.selectedGroup$, mappedUsers$]).pipe(
      map(([allScores, selectedGroup, users]) => this.scoresOfGroup(allScores, selectedGroup, users))
    );

    this.selectedGroupExtendedScores$ = this.selectedGroupScores$.pipe(
      map(scores => scores.map(score => this.calcExtendedScore(score)))
    );

    this.selectedGroupTable$ = combineLatest([this.selectedGroupExtendedScores$, this.usersInSelectedGroup$]).pipe(
      map(([extendedScores, allUsers]) => this.calcGroupTable(extendedScores, allUsers))
    );
  }

  setSelection(groupId: string) {
    this.userSelection$.next(groupId);
  }

  private calcEffectiveSelection(userSelection: string, userGroupIds: string[]) {
    if ((userSelection !== '') && userGroupIds.includes(userSelection))
      return userSelection;

    if (userGroupIds.length > 0) return userGroupIds[0];

    return '';
  }

  private scoresOfGroup(scores: Score[], group: Group | null, users: StringMapping<User>): Score[] {
    let res = scores.map(score => ({
      ...score,
      userScores: this.userScoresOfGroup(score, group, users)
    }));

    return res;
  }

  private userScoresOfGroup(score: Score, group: Group | null, users: StringMapping<User>): UserMatchScore[] {
    return Object
      .values(score.userScores)
      .filter(userScore => this.isUserScoreInGroup(userScore, group, users));
  }

  private isUserScoreInGroup(userScore: UserMatchScore, group: Group | null, users: StringMapping<User>): boolean {
    if (!group) return false;

    let user = users[userScore.email];
    if (!user?.groups) return false;

    return user.groups.includes(group.id);
  }

  private calcExtendedScore(score: Score): ExtendedScore {
    let correctCount = score.userScores
      .filter(us => (us.guess) && (us.guess === score.correctGuess))
      .length;
    let pointPerCorrect = correctCount > 0
      ? score.points / correctCount
      : 0;
    let isSolo = correctCount === 1;

    let isCorrect = (guess: GuessScore | null) => Boolean(guess) && guess === score.correctGuess;

    let res: ExtendedScore = {
      ...score,
      correctGuessesCount: correctCount,
      hasScore: (score.awayScore !== null) && (score.homeScore !== null),
      userScores: score.userScores
        .map<ExtendedUserScore>(us => ({
          ...us,
          isCorrect: isCorrect(us.guess),
          points: isCorrect(us.guess) ? pointPerCorrect : 0,
          isSolo: isCorrect(us.guess) ? isSolo : false
        }))
    }

    return res;
  }

  private calcGroupTable(extendedScores: ExtendedScore[], allUsers: User[]): UserTableRow[] {
    let allScores = selectMany(extendedScores, es => es.userScores);
    let groups = groupByString(allScores, es => es.email);

    return allUsers
      .map<UserTableRow>(user => ({
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoUrl,
        totalCorrect: groups[user.email]?.filter(es => es.isCorrect)?.length ?? 0,
        totalPoints: sum(groups[user.email], es => es.points),
        totalSolo: groups[user.email]?.filter(es => es.isSolo)?.length ?? 0
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }
}
