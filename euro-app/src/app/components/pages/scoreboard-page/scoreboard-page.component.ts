import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTableRow } from 'src/app/models/user-table-row.model';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

interface ViewModel {
  tableRows: UserTableRow[];
  pointsInBank: number;
  me: string;
}

@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrls: ['./scoreboard-page.component.scss']
})
export class ScoreboardPageComponent implements OnInit {
  tableRows$!: Observable<UserTableRow[]>;
  pointsInBank$!: Observable<number>;
  me$!: Observable<string>;
  vm$!: Observable<ViewModel>;

  columns = ['index', 'name', 'score', 'solos', 'guesses'] as const;

  constructor(
    private groupService: SelectedGroupService, 
    private data: DataService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.tableRows$ = this.groupService.selectedGroupTable$;
    this.pointsInBank$ = this.data.pointsInBank$;
    this.me$ = this.auth.currentUser$.pipe(
      map(us => us?.email??'')
    );

    this.vm$ = combineLatest([this.tableRows$, this.pointsInBank$, this.me$]).pipe(
      map(([tableRows, pointsInBank, me]) => ({tableRows, pointsInBank, me}))
    );
  }

}
