import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Match } from 'src/app/models/match.model';
import { DataService } from 'src/app/services/data.service';
import { GuessScore } from 'src/app/models/guess-score.model';
import { Guess } from 'src/app/models/guess.model';
import { NumberMapping } from 'src/app/tools/mappings';
import { map } from 'rxjs/operators';

interface MatchViewModel extends Match {
  guess: string | null;
}

@Component({
  selector: 'app-coming-up',
  templateUrl: './coming-up.component.html',
  styleUrls: ['./coming-up.component.scss']
})
export class ComingUpComponent implements OnInit {
  comingUp$!: Observable<MatchViewModel[]>;



  constructor(private data: DataService) { }

  ngOnInit(): void {
    const matches$ = this.data.comingUpMatches$;

    const allGuesses$ = this.data.allUserGuesses$;

    this.comingUp$ = combineLatest([matches$, allGuesses$]).pipe(
      map(all => this.createViewModels(...all))
    );



  }

  createViewModels(matches: Match[], guesses: NumberMapping<Guess>): MatchViewModel[] {
    return matches.map(m => ({
      ...m, 
      guess: this.calcGuess(m, guesses[m.id]?.score??null)
    }));
  }

  calcGuess(match: Match, guessScore: GuessScore | null): string  | null{
    if (guessScore === 'tie') return 'Tie';
    if (guessScore === 'home') return match.home;
    if (guessScore === 'away') return match.away;
    return null;    
  }

}
