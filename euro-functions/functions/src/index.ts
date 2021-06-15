import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from 'cors';
import * as express from 'express';
import { validateUserToken } from "./middlewares/validate-user-token.middleware";
import { Guess } from "./models/guess.model";
import { calcScore, fetchAllCollection } from "./tools/helper-functions";
import { Match } from "./models/match.model";
import { Stage } from "./models/stage.model";
import { User } from "./models/user.model";
import { PubSub } from "@google-cloud/pubsub";
import { isNotNullOrUndefined } from "./tools/is-not-null";

const corsHandler = cors({ origin: true });
const api = express();
const openApi = express();

api.use(corsHandler);
openApi.use(corsHandler);

api.use(validateUserToken);
admin.initializeApp();

api.get('/hello', (req, res) => {
    console.log('hi there');
    const user = res.locals.user;
    console.log('user = ', user);
    
    res.send('"Hello From firebase 2!!!"');
});

api.get('/matches', async (req, res) => {
    const matches = await fetchAllCollection<Match>('matches', 'id');

    res.send(matches);
});

api.post('/matches', async (req, res) => {
    const matches = admin.firestore().collection('matches');
    const data = JSON.parse(req.body) as Match[];

    var setPromises = data
        .map(obj => matches.doc(obj.id.toString().padStart(2, '0')).set(obj));

    await Promise.all(setPromises);

    res.status(200).send();
});

api.get('/stages', async(req, res) => {
    const stages = await fetchAllCollection<Stage>('stages', 'id');
    res.send(stages);
});

api.post('/stages', async (req, res) => {
    const matches = admin.firestore().collection('stages');
    const data = JSON.parse(req.body) as Stage[];

    var setPromises = data
        .map(obj => matches.doc(obj.id).set(obj));

    await Promise.all(setPromises);

    res.status(200).send();
});



api.post('/users', async (req, res) => {
    const users = admin.firestore().collection('users');
    const data = JSON.parse(req.body) as User;

    await users.doc(data.email).set({
        ...data
    });

    res.status(200).send();
});

api.post('/users/guesses', async (req, res) => {
    const user = res.locals.user;
    const email = user.email;
    const guess = JSON.parse(req.body) as Guess;
    console.group('updating guess');
    console.log(email);
    console.log(JSON.stringify(guess));

    // const match = (await admin.firestore()
    //                          .collection('matches')
    //                          .doc(guess.matchId.toString().padStart(2, '0'))
    //                          .get()).data() as Match;
    
    // if (Date.now() > new Date(match.date).valueOf()) {
    //     // game has already started
    //     console.warn('Refused: Game already started');
    //     console.groupEnd();
    //     res.status(400).send();
    //     return;
    // }

    await admin.firestore()
            .collection('users')
            .doc(email)
            .collection('guesses')
            .doc(guess.matchId.toString().padStart(2, '0'))
            .set(guess);

    console.log('match guess updated');
    console.groupEnd();
    res.status(200).send();
});

const ps = new PubSub();
openApi.get('/triggerPublish', async (req, res) => {
    await ps.topic('firebase-schedule-publishScores').publishJSON({});
    res.status(200).send();
});


export const createUserRecord = functions.auth.user().onCreate(async user => {
    console.log('New user spotted');
    console.log('email: ', user.email);
    console.log('displayName', user.displayName);
    console.log('photo', user.photoURL);

    if (user && user.email) {
        await admin.firestore()
            .collection('users')
            .doc(user.email)
            .set({
                email: user.email,
                displayName: user.displayName,
                photoUrl: user.photoURL
            });
    }
});

export const publishScores = functions.pubsub.schedule('01 * * * *').onRun(async context => {
    console.log('starting to publish scores');
    let scores = admin.firestore().collection('scores');

    let promises = [
        fetchAllCollection<Match>('matches', 'id'),
        fetchAllCollection<User>('users'),
        fetchAllCollection<Stage>('stages')    
    ] as const;

    let [matches, users, stages] = await Promise.all(promises);

    console.log(`publisher fetched ${matches.length} matches, ${users.length} users, ${stages.length} stages`);

    let isScored = (match: Match) => isNotNullOrUndefined(match.awayScore) 
                                    && isNotNullOrUndefined(match.homeScore);

    let scoredMatches = matches
        .filter(match => isScored(match));

    let unscoredMatches = matches
        .filter(match => !isScored(match));

    // first, delete all records for unfinished matches
    console.log('removing scores for not finished matches');

    let deletes = unscoredMatches
        .map(match => scores.doc(match.id.toString().padStart(2, '0')).delete());
    await deletes;


    // create scores for all scoredMatches
    console.log(`calculating scores for ${scoredMatches.length} matches`);

    let matchScores = await Promise.all(scoredMatches.map(match => calcScore(match, users, stages)));

    console.log(`calculated ${matchScores.length} scores, now saving to DB`);

    await Promise.all(matchScores
        .map(ms => scores
                        .doc(ms.id.toString().padStart(2, '0'))
                        .set(ms)));

    console.log('completd publish scores');
});


exports.api = functions.https.onRequest(api);
exports.openApi = functions.https.onRequest(openApi);