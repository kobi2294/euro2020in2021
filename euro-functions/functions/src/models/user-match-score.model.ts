import { GuessScore } from "./guess-score.model";

export interface UserMatchScore {
    email: string;
    displayName: string;
    guess: GuessScore | null;
}