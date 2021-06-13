import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { filterNotNull, isNotNull } from 'src/app/tools/is-not-null';
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

  constructor(
    private authService: AuthService,
    private db: AngularFirestore, 
    private api: FunctionsService) { }

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
  }

  async toggleSelection(groupId: string) {
    console.log('toggle selection ', groupId);

    let user = await this.currentUser$.pipe(first()).toPromise();

    console.log('before change', user);

    let groups = user.groups ?? [];

    groups = groups.includes(groupId) 
      ? groups.filter(item => item !== groupId)
      : [...groups, groupId];

    user = {
      ...user, 
      groups: groups
    };

    await this.api.updateUser(user);
  }

}
