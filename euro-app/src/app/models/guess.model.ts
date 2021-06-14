import { GuessScore } from "./guess-score.model";

export interface Guess {
    matchId: number;
    score: GuessScore;
}