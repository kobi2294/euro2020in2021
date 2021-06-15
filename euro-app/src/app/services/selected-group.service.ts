import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Group } from '../models/group.model';
import { StringMapping, toStringMapping } from '../tools/mappings';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedGroupService {
  private userSelection$ = new BehaviorSubject<string>('');
  readonly userGroupIds$!: Observable<string[]>;
  private allGroups$!: Observable<StringMapping<Group>>;

  readonly selectedGroup$!: Observable<Group | null>;
  readonly userGroups$!: Observable<Group[]>;

  constructor(
    private auth: AuthService, 
    private db: AngularFirestore
  ) { 
    this.allGroups$ = this.db.collection<Group>('groups').valueChanges().pipe(
      map(groups => toStringMapping(groups, group => group.id)), 
      shareReplay(1)
    );

    this.userGroupIds$ = this.auth.currentUser$.pipe(
      map(user => user?.groups ?? []), 
    );

    let selectedGroupId$ = combineLatest([this.userSelection$, this.userGroupIds$]).pipe(
      map(([userSelection, userGroupIds]) => this.calcEffectiveSelection(userSelection, userGroupIds))
    );

    this.selectedGroup$ = combineLatest([selectedGroupId$, this.allGroups$]).pipe(
      map(([selectedGroupId, allGroups]) => selectedGroupId !== '' ? allGroups[selectedGroupId] : null)
    );

    this.userGroups$ = combineLatest([this.userGroupIds$, this.allGroups$]).pipe(
      map(([userGroupIds, allGroups]) => userGroupIds.map(id => allGroups[id]))
    )

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
}
