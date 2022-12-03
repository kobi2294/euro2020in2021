import * as admin from "firebase-admin";
import { GuessScore } from "../models/guess-score.model";
import { Guess } from "../models/guess.model";
import { Match } from "../models/match.model";
import { Score } from "../models/score.model";
import { Stage } from "../models/stage.model";
import { UserMatchScore } from "../models/user-match-score.model";
import { User } from "../models/user.model";
import { isNotNullOrUndefined } from "./is-not-null";

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

export function stageOf(match: Match, stages: Stage[]): Stage | undefined{
    return stages.find(s => (s.displayName === (match.stage ?? ''))
                        || (s.names && s.names.includes(match.stage??'')));
  }

export async function calcScore(match: Match, users: User[], stages: Stage[]): Promise<Score> {
    let guesses = await Promise.all(users.map(user => admin
        .firestore()
        .doc(`users/${user.email}/guesses/${match.id.toString().padStart(2, '0')}`)
        .get()
        .then(res => [user, res.data() as Guess] as const)));

    console.log(JSON.stringify(match));

    let points = stageOf(match, stages)?.points ?? 0;

    let userScores: UserMatchScore[] = guesses
        .map(pair => ({
            email: pair[0].email,
            displayName: pair[0].displayName,
            guess: pair[1]?.score ?? null
        }))
        .sort((a, b) => b.displayName > a.displayName ? 1 : -1);

    let homeGuesses = userScores.filter(us => us.guess === 'home').length;
    let awayGuesses = userScores.filter(us => us.guess === 'away').length;
    let tieGuesses = userScores.filter(us => us.guess === 'tie').length;

    return {
        id: match.id,
        date: match.date,
        home: match.home,
        away: match.away,
        stage: match.stage!,
        awayScore: match.awayScore??null,
        homeScore: match.homeScore??null,
        correctGuess: calcCorrectGuess(match),
        points: points,
        userScores: userScores, 
        guessCount: {
            home: homeGuesses, 
            away: awayGuesses, 
            tie: tieGuesses
        }
    }
}

export function calcCorrectGuess(match: Match): GuessScore | null {
    if ((typeof (match.awayScore) === 'undefined')
        || (typeof (match.homeScore) === 'undefined')
        || (match.awayScore === null)
        || (match.homeScore === null))
        return null;

    if (match.awayScore > match.homeScore) return 'away';
    if (match.homeScore > match.awayScore) return 'home';
    return 'tie';
}

export async function publishScoresOfPastMatches() {
    console.log('starting to publish scores');
    let scores = admin.firestore().collection('scores');

    let promises = [
        fetchAllCollection<Match>('matches', 'id'),
        fetchAllCollection<User>('users'),
        fetchAllCollection<Stage>('stages')    
    ] as const;

    let [matches, users, stages] = await Promise.all(promises);

    console.log(`publisher fetched ${matches.length} matches, ${users.length} users, ${stages.length} stages`);

    let now = Date.now();
    let isPast = (match: Match) => isNotNullOrUndefined(match.date) 
                    && new Date(match.date).valueOf() < now;

    let pastMatches = matches
        .filter(match => isPast(match));    

    let futureMatches = matches
        .filter(match => !isPast(match));

    // first, delete all records for unfinished matches
    console.log('removing scores for future matches');

    let deletes = futureMatches
        .map(match => scores.doc(match.id.toString().padStart(2, '0')).delete());
    await deletes;


    // create scores for all scoredMatches
    console.log(`calculating scores for ${pastMatches.length} matches`);

    const recentMatches = pastMatches
        .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
        .slice(0, 3);

    let matchScores = await Promise.all(recentMatches.map(match => calcScore(match, users, stages)));

    console.log(`calculated ${matchScores.length} scores, now saving to DB`);

    await Promise.all(matchScores
        .map(ms => scores
                        .doc(ms.id.toString().padStart(2, '0'))
                        .set(ms)));

    console.log('completd publish scores');

}