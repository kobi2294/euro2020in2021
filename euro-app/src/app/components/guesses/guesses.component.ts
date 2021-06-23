import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, interval, Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GuessScore } from 'src/app/models/guess-score.model';
import { Guess } from 'src/app/models/guess.model';
import { MatchRecord } from 'src/app/models/match-record';
import { Match } from 'src/app/models/match.model';
import { Stage } from 'src/app/models/stage.model';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { sum } from 'src/app/tools/aggregations';

@Component({
  selector: 'app-guesses',
  templateUrl: './guesses.component.html',
  styleUrls: ['./guesses.component.scss']
})
export class GuessesComponent implements OnInit {
  records$!: Observable<MatchRecord[]>;
  pointsInBank$!: Observable<number>;

  constructor(
    private data: DataService, 
    private api: ApiService
  ) { }

  ngOnInit(): void {
    let now = Date.now().valueOf();

    this.records$ = combineLatest([timer(0, 60000), this.data.myMatchRecords$]).pipe(
      map(([_, records]) => records
                    .filter(record => record.date.valueOf() > now)
                    .filter(record => record.match.home && record.match.away))
    );

    this.pointsInBank$ = combineLatest([this.data.allMatches$, this.data.allStages$]).pipe(
      map(([matches, stages]) => sum(matches
        .filter(m => new Date(m.date).valueOf() > now)
        .map(m => this.stageOf(m, stages)), item => item?.points??0))
    );
    
  }

  private stageOf(match: Match, stages: Stage[]): Stage | undefined{
    return stages.find(s => (s.displayName === (match.stage ?? ''))
                        || (s.names && s.names.includes(match.stage??'')));
  }


  trackByMatchId(index: number, record: MatchRecord) {
    return record.match.id;
  }

  async setGuess(matchId: number, score: GuessScore) {
    let guess: Guess = {
      matchId, 
      score
    };

    await this.api.setUserGuess(guess);    
  }

}
