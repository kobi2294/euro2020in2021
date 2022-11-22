import { CountryEnum } from "./country-enum.model";
import { ExtendedUserScore } from "./extended-user-score.model";
import { GuessScore } from "./guess-score.model";
import { ScoreGuessCount } from "./score.model";

export interface ExtendedScore {
    id: number;
    home: CountryEnum;
    away: CountryEnum;
    date: string;
    stage: string;
    homeScore: number | null;
    awayScore: number | null;
    correctGuess: GuessScore | null;
    points: number;
    hasScore: boolean;
    correctGuessesCount: number;
    userScores: ExtendedUserScore[];
    guessCount: ScoreGuessCount;
}