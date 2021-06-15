import { CountryEnum } from "./country-enum.model";
import { GuessScore } from "./guess-score.model";
import { UserMatchScore } from "./user-match-score.model";

export interface Score {
    id: number;
    home: CountryEnum;
    away: CountryEnum;
    date: string;
    stage: string;
    homeScore: number | null;
    awayScore: number | null;
    correctGuess: GuessScore | null;
    points: number;
    userScores: UserMatchScore[];
}