import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { AuthService } from 'src/app/services/auth.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';
import { browseableGroups } from 'src/app/tools/user-functions';

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss']
})
export class GroupSelectorComponent implements OnInit {
  groups$!: Observable<Group[]>;
  selectedGroup$!: Observable<Group | null>;

  constructor(
    private auth: AuthService,
    private selectedGroupService: SelectedGroupService
  ) { }

  ngOnInit(): void {
    this.groups$ = combineLatest([this.auth.currentUser$, this.auth.isSuper$, this.selectedGroupService.allGroups$]).pipe(
      map(([user, isSuper, groups]) => browseableGroups(user, isSuper, groups))
    );

    this.selectedGroup$ = this.selectedGroupService.selectedGroup$; 
  }

  selectGroup(id: string) {
    this.selectedGroupService.setSelection(id);
  }

}
