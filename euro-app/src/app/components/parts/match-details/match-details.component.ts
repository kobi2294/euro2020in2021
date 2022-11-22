import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ExtendedScore } from 'src/app/models/extended-score.model';
import { GuessScore } from 'src/app/models/guess-score.model';
import { ScoreGuessCount } from 'src/app/models/score.model';
import { count } from 'src/app/tools/count';

interface Summary {
  home: number;
  away: number;
  tie: number;
  correct: GuessScore | null;
  correctCount: number | null;
  totalPoints: number;
  scorePerGuesser: number | null
}

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent implements OnInit {

  score$ = new BehaviorSubject<ExtendedScore | null>(null);

  forceExtend$ = new BehaviorSubject(false);

  extended$!: Observable<boolean>;

  summary$!: Observable<Summary>;

  canClose$!: Observable<boolean>;

  statistics$!: Observable<ScoreGuessCount | null>;


  @Input()
  set score(value: ExtendedScore| null) {
    this.score$.next(value);
  }
  get score(): ExtendedScore | null {
    return this.score$.value;
  }
  

  constructor() { }

  ngOnInit(): void {
    this.extended$ = combineLatest([this.score$, this.forceExtend$]).pipe(
      map(([score, force]) => force || (score?.userScores?.length ?? 0) <= 8), 
      distinctUntilChanged()
    );

    this.canClose$ = combineLatest([this.extended$, this.score$]).pipe(
      map(([extended, score]) => (extended && (score?.userScores?.length ?? 0) > 8))
    );

    this.summary$ = this.score$.pipe(
      map(score => this.createSummary(score))
    );

    this.statistics$ = this.score$.pipe(
      map(score => this.normalizeCounts(score?.guessCount ?? null))
    );
  }

  normalizeCounts(counts: ScoreGuessCount | null): ScoreGuessCount | null {
    if (!counts) return null;
    const sum = counts.home + counts.tie + counts.away;
    if (sum === 0) return null;

    return {
      home: counts.home / sum, 
      tie: counts.tie / sum, 
      away: counts.away / sum
    }
  }

  createSummary(score: ExtendedScore | null): Summary {
    if ((!score) || (!score.userScores) || (score.userScores.length === 0)) return {
      away: 0, 
      home: 0, 
      tie: 0, 
      correct: null, 
      scorePerGuesser: null, 
      correctCount: null, 
      totalPoints: 0
    }

    const tie = count(score.userScores, us => us.guess === 'tie');
    const home = count(score.userScores, us => us.guess === 'home');
    const away = count(score.userScores, us => us.guess === 'away');

    const correct = score.correctGuess;

    const correctCount = score.correctGuessesCount;

    const totalPoints = score.points;

    const scorePerGuesser = score.correctGuessesCount > 0 
      ? totalPoints / correctCount 
      : 0;

      return {
        tie, 
        home, 
        away, 
        correct, 
        correctCount, 
        totalPoints, 
        scorePerGuesser
      }
  }

}
