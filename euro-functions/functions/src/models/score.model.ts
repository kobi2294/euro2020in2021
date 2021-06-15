import { StringMapping } from "../tools/mappings";
import { CountryEnum } from "./country-enum.model";
import { GuessScore } from "./guess-score.model";
import { UserMatchScore } from "./user-match-score.model";

export interface Score {
    id: number;
    home: CountryEnum;
    away: CountryEnum;
    date: string;
    homeScore: number;
    awayScore: number;
    correctGuess: GuessScore;
    points: number;
    userScores: StringMapping<UserMatchScore>
}