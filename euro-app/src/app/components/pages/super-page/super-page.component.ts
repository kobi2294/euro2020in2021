import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { groupByString } from 'src/app/tools/group-by';
import { toStringMapping } from 'src/app/tools/mappings';
import { selectMany } from 'src/app/tools/select-many';
import { Clipboard } from '@angular/cdk/clipboard';

interface GroupVm extends Group {
  readonly users: User[];
}

interface ViewModel {
  readonly usersCount: number, 
  readonly userlessGroupsCount: number,
  readonly groups: GroupVm[],
  readonly grouplessUsers: User[], 
}

@Component({
  selector: 'app-super-page',
  templateUrl: './super-page.component.html',
  styleUrls: ['./super-page.component.scss']
})
export class SuperPageComponent implements OnInit {
  vm$!: Observable<ViewModel>;


  constructor(
    private db: AngularFirestore, 
    private clipboard: Clipboard
  ) { }

  async ngOnInit() {
    const all$ =  [
      this.db.collection<User>('users').valueChanges(),
      this.db.collection<Group>('groups').valueChanges()
    ] as const;

    this.vm$ = combineLatest([...all$]).pipe(
      map(all => this.calcVm(...all))
    );
  }

  calcVm(users: User[], groups: Group[]): ViewModel {
    const pairs = selectMany(users, user => (user.groups??[]).map(group => ({user, group})));
    const groupsMap = toStringMapping(groups, gr => gr.id);
    const grouped = groupByString(pairs, pair => pair.group);
    const vmGroups: GroupVm[] = groups.map(
      g => ({
        ...g,
        users: (grouped[g.id]??[]).map(pair => pair.user)
      })
    );

    const grouplessUsers = users.filter(user => (user.groups ?? []).length === 0);
    const userlessGroups = vmGroups.filter(g => g.users.length === 0);

    return {
      usersCount: users.length, 
      groups: vmGroups, 
      grouplessUsers, 
      userlessGroupsCount: userlessGroups.length
    }
  }

  copyGroupLink(groupId: string) {
    const url = `${location.origin}/group/${groupId}`;
    console.log(url);
    this.clipboard.copy(url);
  }

  copyUserEmail(user: User) {
    const email = user.email;
    console.log(email);
    this.clipboard.copy(email);
  }



}
