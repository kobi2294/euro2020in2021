import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExtendedScore } from 'src/app/models/extended-score.model';
import { SelectedGroupService } from 'src/app/services/selected-group.service';

@Component({
  selector: 'app-recent-scores',
  templateUrl: './recent-scores.component.html',
  styleUrls: ['./recent-scores.component.scss']
})
export class RecentScoresComponent implements OnInit {

  recentScores$!: Observable<ExtendedScore[]>;

  constructor(private selectedGroupService: SelectedGroupService) { }

  ngOnInit(): void {
    this.recentScores$ = this.selectedGroupService.recentExtendedScore$.pipe(
      tap(res => console.log('recent scores', res))
    )
  }

}
