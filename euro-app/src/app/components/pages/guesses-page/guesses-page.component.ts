import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GuessScore } from 'src/app/models/guess-score.model';
import { Guess } from 'src/app/models/guess.model';
import { MatchRecord } from 'src/app/models/match-record';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { StageEnum } from 'src/app/models/stage-enum.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-guesses',
  templateUrl: './guesses-page.component.html',
  styleUrls: ['./guesses-page.component.scss']
})
export class GuessesPageComponent implements OnInit {
  records$!: Observable<MatchRecord[]>;

  showAd$!: Observable<boolean>;

  constructor(
    private data: DataService, 
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.records$ = this.data.myNextGuesses$;
    this.showAd$ = this.records$.pipe(map(recs => this.shouldShowAd(recs)));
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

  private shouldShowAd(records: MatchRecord[]): boolean {
    if (!records) return true;

    const stages: StageEnum[] = ['Finals', 'Third Place'];

    if (records.every(r => stages.includes(r.match.stage??'Group 1'))) {
      return true;
    }

    return false;

  }

}
