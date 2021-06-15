import { GuessScore } from "./guess-score.model";

export interface ExtendedUserScore {
    email: string;
    displayName: string;
    guess: GuessScore | null;
    isCorrect: boolean;
    points: number;
    isSolo: boolean;
}