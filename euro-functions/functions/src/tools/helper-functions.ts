import * as admin from "firebase-admin";
import { GuessScore } from "../models/guess-score.model";
import { Guess } from "../models/guess.model";
import { Match } from "../models/match.model";
import { Score } from "../models/score.model";
import { Stage } from "../models/stage.model";
import { UserMatchScore } from "../models/user-match-score.model";
import { User } from "../models/user.model";
import { toStringMapping } from "./mappings";

export async function fetchAllCollection<T>(name: string, orderBy?: string): Promise<T[]> {
    let collection = admin.firestore().collection(name);
    let snapshot;

    if (orderBy) {
        snapshot = await collection.orderBy(orderBy).get();
    } else {
        snapshot = await collection.get();
    }

    return snapshot.docs.map(doc => doc.data() as T);
}

export async function calcScore(match: Match, users: User[], stages: Stage[]): Promise<Score> {
    let guesses = await Promise.all(users.map(user => admin
        .firestore()
        .doc(`users/${user.email}/guesses/${match.id.toString().padStart(2, '0')}`)
        .get()
        .then(res => [user, res.data() as Guess] as const)));

    console.log('calc score');
    console.log(JSON.stringify(match));

    let matchStage = (match.stage ?? 'group 1').toLowerCase();

    let points = stages.find(stage => matchStage.includes(stage.id.toLowerCase()))?.points ?? 0;

    let userScores: UserMatchScore[] = guesses.filter(pair => pair[1])
        .map(pair => ({
            email: pair[0].email,
            displayName: pair[0].displayName,
            guess: pair[1].score
        }));

    return {
        id: match.id,
        date: match.date,
        home: match.home,
        away: match.away,
        awayScore: match.awayScore ?? 0,
        homeScore: match.homeScore ?? 0,
        correctGuess: calcCorrectGuess(match),
        points: points,
        userScores: toStringMapping(userScores, sc => sc.email)
    }
}

export function calcCorrectGuess(match: Match): GuessScore {
    if ((typeof (match.awayScore) === 'undefined')
        || (typeof (match.homeScore) === 'undefined')
        || (match.awayScore === null)
        || (match.homeScore === null))
        return 'tie';

    if (match.awayScore > match.homeScore) return 'away';
    if (match.homeScore > match.awayScore) return 'home';
    return 'tie';
}