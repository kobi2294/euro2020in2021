import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Score } from 'src/app/models/score.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  scores$!: Observable<Score[]>;

  constructor(
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.scores$ = this.data.allScores$.pipe(
      map(scores => scores.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()))
    );
  }

}
