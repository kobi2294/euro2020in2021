import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-group-selector',
  templateUrl: './group-selector.component.html',
  styleUrls: ['./group-selector.component.scss']
})
export class GroupSelectorComponent implements OnInit {
  groups$!: Observable<Group[]>;
  selectedGroup$!: Observable<Group>;

  constructor(
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.groups$ = this.db.collection<Group>('groups').valueChanges(); 
    this.selectedGroup$ = of({
      id: 'altman', 
      displayName: 'Altman' 
    })   
  }

}
