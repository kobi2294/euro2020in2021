import { Guess } from "./guess.model";
import { Match } from "./match.model";

export interface MatchRecord {
    match: Match;
    date: Date;
    guess?: Guess;
}