import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTableRow } from 'src/app/models/user-table-row.model';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';


@Component({
  selector: 'app-scoreboard-page',
  templateUrl: './scoreboard-page.component.html',
  styleUrls: ['./scoreboard-page.component.scss']
})
export class ScoreboardPageComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
