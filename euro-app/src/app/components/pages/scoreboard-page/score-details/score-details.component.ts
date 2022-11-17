import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExtendedScore } from 'src/app/models/extended-score.model';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

@Component({
  selector: 'app-score-details',
  templateUrl: './score-details.component.html',
  styleUrls: ['./score-details.component.scss']
})
export class ScoreDetailsComponent implements OnInit {
  scores$!: Observable<ExtendedScore[]>;

  constructor(
    private groupService: SelectedGroupService, 

  ) { }

  ngOnInit(): void {
    this.scores$ = this.groupService.selectedGroupExtendedScores$;
  }

}
