import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss']
})
export class GroupSelectorComponent implements OnInit {
  groups$!: Observable<Group[]>;
  selectedGroup$!: Observable<Group | null>;

  constructor(
    private selectedGroupService: SelectedGroupService
  ) { }

  ngOnInit(): void {
    this.groups$ = this.selectedGroupService.userGroups$;
    this.selectedGroup$ = this.selectedGroupService.selectedGroup$; 
  }

  selectGroup(id: string) {
    this.selectedGroupService.setSelection(id);
  }

}
