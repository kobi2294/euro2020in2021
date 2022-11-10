import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { filterNotNull } from 'src/app/tools/is-not-null';
import { mapStrings, StringMapping } from 'src/app/tools/mappings';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser$!: Observable<User>;
  userGroups$!: Observable<Group[]>;
  admin$!: Observable<string>;

  constructor(
    private authService: AuthService,
    private db: AngularFirestore, 
    private api: ApiService) { }

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$.pipe(
      filterNotNull()
    );

    const allGroups$ = this.db.collection<Group>('groups').valueChanges();
    this.userGroups$ = combineLatest([allGroups$, this.currentUser$]).pipe(
      map(([all, user]) => all.filter(g => user.groups && user.groups.includes(g.id)))
    );

    this.admin$ = this.authService.isAdmin$.pipe(
      map(val => val ? 'an admin' : 'not an admin')
    )
  }

  async toggleSelection(groupId: string, newValue: boolean) {
    let user = await this.currentUser$.pipe(first()).toPromise();
    let groups = user.groups ?? [];

    groups = newValue
      ? [...groups, groupId]
      : groups.filter(item => item !== groupId);

    user = {
      ...user, 
      groups: groups
    };

    await this.api.updateUser(user);
  }

}
