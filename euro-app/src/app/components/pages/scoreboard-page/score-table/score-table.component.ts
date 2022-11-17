import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit {
  vm$!: Observable<ViewModel>;

  columns = ['index', 'name', 'score', 'solos', 'guesses'] as const;

  constructor(
    private groupService: SelectedGroupService, 
    private data: DataService,
    private auth: AuthService
    
    ) { }

  ngOnInit(): void {
    const tableRows$ = this.groupService.selectedGroupTable$;
    const pointsInBank$ = this.data.pointsInBank$;
    const me$ = this.auth.currentUser$.pipe(
      map(us => us?.email??'')
    );

    this.vm$ = combineLatest([tableRows$, pointsInBank$, me$]).pipe(
      map(([tableRows, pointsInBank, me]) => ({tableRows, pointsInBank, me}))
    );
  }

}
