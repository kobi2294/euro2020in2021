import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, timer } from 'rxjs';
import { Match } from 'src/app/models/match.model';
import { DataService } from 'src/app/services/data.service';
import { GuessScore } from 'src/app/models/guess-score.model';
import { Guess } from 'src/app/models/guess.model';
import { NumberMapping, StringMapping, toStringMapping } from 'src/app/tools/mappings';
import { map } from 'rxjs/operators';
import { selectMany } from 'src/app/tools/select-many';
import { Stage } from 'src/app/models/stage.model';
import { StageEnum } from 'src/app/models/stage-enum.model';

interface MatchViewModel extends Match {
  guess: string | null;
  points: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

interface Alert {
  isKnockout: boolean;
  stage: StageEnum;
  points: number;
}

@Component({
  selector: 'app-coming-up',
  templateUrl: './coming-up.component.html',
  styleUrls: ['./coming-up.component.scss']
})
export class ComingUpComponent implements OnInit {
  comingUp$!: Observable<MatchViewModel[]>;

  remainingTime$!: Observable<TimeRemaining>;

  alert$!: Observable<Alert | null>;



  constructor(private data: DataService) { }

  ngOnInit(): void {
    const matches$ = this.data.comingUpMatches$;

    const stages$ = this.data.allStages$;

    const allGuesses$ = this.data.allUserGuesses$;

    this.comingUp$ = combineLatest([matches$, allGuesses$, stages$]).pipe(
      map(all => this.createViewModels(...all))
    );

    this.remainingTime$ = combineLatest([timer(0, 60000), matches$]).pipe(
      map(([_, all]) => this.calcRemainingTime(all[0]))
    );

    this.alert$ = this.comingUp$.pipe(
      map(matches => this.calcAlert(matches))
    )

  }

  mapStagesByNames(stages: Stage[]): StringMapping<Stage> {
    const byDisplayName = stages.map(s => [s.displayName, s] as const);
    const byNames = selectMany(stages, s => (s.names??[]).map(n => [n, s] as const));

    const allPairs = [...byDisplayName, ...byNames];
    const res = toStringMapping(allPairs, p => p[0], p => p[1]);
    return res;
  }

  createViewModels(matches: Match[], guesses: NumberMapping<Guess>, stages: Stage[]): MatchViewModel[] {
    const stageMap = this.mapStagesByNames(stages);

    return matches.map(m => ({
      ...m, 
      guess: this.calcGuess(m, guesses[m.id]?.score??null), 
      points: stageMap[m.stage??'']?.points??0, 
      isKnockout: this.isKnockout(m)
    }));
  }

  isKnockout(match: Match): boolean {
    const knockouts: StageEnum[] = ['Round Of 16', 'Quarter Finals', 'Semi Finals', 'Third Place', 'Finals'];
    return (match.stage !== undefined) 
          && knockouts.includes(match.stage);
  }

  calcAlert(matches: MatchViewModel[]): Alert | null{
    const next = matches[0];

    if (!next) return null;
    const isKnockout = this.isKnockout(next);
    if (!isKnockout) return null;

    return {
      isKnockout,
      stage: next.stage??'Finals', 
      points: next.points
    }
  }


  calcGuess(match: Match, guessScore: GuessScore | null): string  | null{
    if (guessScore === 'tie') return 'Tie';
    if (guessScore === 'home') return match.home;
    if (guessScore === 'away') return match.away;
    return null;    
  }

  calcRemainingTime(match: Match | null): TimeRemaining {
    if (!match) return {days: 0, hours: 0, minutes: 0};

    const total = Date.parse(match.date) - new Date().valueOf();
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
  
    return {
      days,
      hours,
      minutes,
    };

  }
}
