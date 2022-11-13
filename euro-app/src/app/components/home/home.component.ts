import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ExtendedScore } from 'src/app/models/extended-score.model';
import { DataService } from 'src/app/services/data.service';
import { PwaService } from 'src/app/services/pwa.service';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  scores$!: Observable<ExtendedScore[]>;

  hasScores$!: Observable<boolean>;
  hasGroups$!: Observable<boolean>;

  constructor(
    private groupService: SelectedGroupService, 
    private data:DataService
  ) { }

  ngOnInit(): void {
    // now we need to reduce it to only the players in the current group
    this.scores$ = this.groupService.selectedGroupExtendedScores$;

    this.hasScores$ = this.scores$.pipe(
      map(all => all.length > 0)
    );

    this.hasGroups$ = this.groupService.userHasGroups$;

  }


}
