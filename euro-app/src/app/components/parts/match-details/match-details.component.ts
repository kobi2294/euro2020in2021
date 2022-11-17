import { Component, Input, OnInit } from '@angular/core';
import { ExtendedScore } from 'src/app/models/extended-score.model';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent implements OnInit {
  @Input()
  score: ExtendedScore | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
