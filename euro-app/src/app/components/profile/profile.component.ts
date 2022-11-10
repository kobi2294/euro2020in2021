import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { merge, Observable, Subject } from 'rxjs';
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
  groups$!: Observable<Group[]>;
  selectedGroups$!: Observable<StringMapping<true>>;
  hasGroups$!: Observable<boolean>;
  admin$!: Observable<string>;

  constructor(
    private authService: AuthService,
    private db: AngularFirestore, 
    private api: ApiService) { }

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$.pipe(
      filterNotNull()
    );

    this.groups$ = this.db.collection<Group>('groups').valueChanges();

    this.selectedGroups$ = this.currentUser$.pipe(
      map(user => mapStrings(user.groups ?? []))
    )

    this.hasGroups$ = this.selectedGroups$.pipe(
      map(groups => Object.keys(groups).length > 0)
    );

    this.admin$ = this.authService.isAdmin$.pipe(
      map(val => val ? 'an admin' : 'not an admin')
    )
  }

  async toggleSelection(groupId: string, newValue: boolean) {
    let user = await this.currentUser$.pipe(first()).toPromise();
    let groups = user.groups ?? [];

    await new Promise(res => setTimeout(res, 2000));

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
