import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { groupByString } from 'src/app/tools/group-by';
import { StringMapping, toStringMapping } from 'src/app/tools/mappings';
import { selectMany } from 'src/app/tools/select-many';
import { Clipboard } from '@angular/cdk/clipboard';
import { SuperService } from 'src/app/services/super.service';
import { Audit } from 'src/app/models/audit.model';
import { environment } from 'src/environments/environment';

interface UserVm extends User {
  version: string, 
  loggedLately: boolean
}

interface GroupVm extends Group {
  readonly users: UserVm[];
}

interface ViewModel {
  readonly usersCount: number, 
  readonly userlessGroupsCount: number,
  readonly groups: GroupVm[],
  readonly grouplessUsers: UserVm[], 
  readonly auditedCount: number;
  readonly latestVersionCount: number;
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
    private clipboard: Clipboard, 
    private superService: SuperService
  ) { }

  async ngOnInit() {
    const all$ =  [
      this.db.collection<User>('users').valueChanges(),
      this.db.collection<Group>('groups').valueChanges(), 
      this.superService.userAudit$
    ] as const;

    this.vm$ = combineLatest([...all$]).pipe(
      map(all => this.calcVm(...all))
    );
  }

  calcVm(users: User[], groups: Group[], audit: StringMapping<Audit>): ViewModel {
    const pairs = selectMany(users, user => (user.groups??[]).map(group => ({user, group})));
    const groupsMap = toStringMapping(groups, gr => gr.id);
    const grouped = groupByString(pairs, pair => pair.group);
    const vmGroups: GroupVm[] = groups.map(
      g => ({
        ...g,
        users: (grouped[g.id]??[])
            .map(pair => pair.user)
            .map(user => this.createUserVm(user, audit))
      })
    );

    const grouplessUsers = users
      .filter(user => (user.groups ?? []).length === 0)
      .map(u => this.createUserVm(u, audit));

    const userlessGroups = vmGroups
      .filter(g => g.users.length === 0);

    const latestVersionCount = Object
      .values(audit)
      .filter(a => a.version === environment.version)
      .length;

    return {
      usersCount: users.length, 
      groups: vmGroups, 
      grouplessUsers,
      userlessGroupsCount: userlessGroups.length, 
      auditedCount: Object.keys(audit).length, 
      latestVersionCount
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

  createUserVm(user: User, audit: StringMapping<Audit>) : UserVm{
    const auditRecord = audit[user.email];
    const now = Date.now();

    const LoggedLately = auditRecord && ((now - new Date(auditRecord.timestamp).valueOf()) < 60 * 60 * 1000);

    return {
      ...user, 
      version: auditRecord?.version ?? '', 
      loggedLately: LoggedLately
    }
  }



}
