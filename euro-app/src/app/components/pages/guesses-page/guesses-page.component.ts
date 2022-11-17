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
  templateUrl: './guesses-page.component.html',
  styleUrls: ['./guesses-page.component.scss']
})
export class GuessesPageComponent implements OnInit {
  records$!: Observable<MatchRecord[]>;

  constructor(
    private data: DataService, 
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.records$ = this.data.myNextGuesses$;
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
