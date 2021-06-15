import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, interval, Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GuessScore } from 'src/app/models/guess-score.model';
import { Guess } from 'src/app/models/guess.model';
import { MatchRecord } from 'src/app/models/match-record';
import { Match } from 'src/app/models/match.model';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-guesses',
  templateUrl: './guesses.component.html',
  styleUrls: ['./guesses.component.scss']
})
export class GuessesComponent implements OnInit {
  records$!: Observable<MatchRecord[]>;

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
