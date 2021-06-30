import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { UserTableRow } from 'src/app/models/user-table-row.model';
import { DataService } from 'src/app/services/data.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  tableRows$!: Observable<UserTableRow[]>;
  pointsInBank$!: Observable<number>;
  columns = ['index', 'name', 'score', 'solos', 'guesses'] as const;

  constructor(
    private groupService: SelectedGroupService, 
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.tableRows$ = this.groupService.selectedGroupTable$;
    this.pointsInBank$ = this.data.pointsInBank$;
  }

}
