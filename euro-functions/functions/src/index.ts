import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from 'cors';
import * as axios from 'axios';
import * as express from 'express';
import { validateUserToken } from "./middlewares/validate-user-token.middleware";
import { Guess } from "./models/guess.model";
import { fetchAllCollection, publishScoresOfPastMatches } from "./tools/helper-functions";
import { Match } from "./models/match.model";
import { Stage } from "./models/stage.model";
import { User } from "./models/user.model";
import { parseMatches } from "./tools/crawl";
import { logRequest } from "./middlewares/log-request.middleware";

const corsHandler = cors({ origin: true });
const api = express();
api.use(corsHandler);
api.use(validateUserToken);
api.use(logRequest);

const openApi = express();
openApi.use(corsHandler);

const crawl = express();
crawl.use(corsHandler);

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
    console.log('updating user');
    const users = admin.firestore().collection('users');
    const data = JSON.parse(req.body) as User;

    console.log('email', data);

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

    const match = (await admin.firestore()
                             .collection('matches')
                             .doc(guess.matchId.toString().padStart(2, '0'))
                             .get()).data() as Match;
    
    if (Date.now() > new Date(match.date).valueOf()) {
        // game has already started
        console.warn('Refused: Game already started');
        console.groupEnd();
        res.status(400).send();
        return;
    }

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

openApi
.get('/triggerPublish', async (req, res) => {
    await publishScoresOfPastMatches();
    res.status(200).send();
});

crawl.get('/matches', async(req, res) => {
    let url = 'https://www.eurosport.com/_ajax_/results_v8_5/results_teamsports_v8_5.zone?O2=1&langueid=0&domainid=135&mime=text/json&dropletid=146&sportid=22&eventid=36881&SharedPageTheme=black&DeviceType=desktop&roundid=5005';
    let data = (await axios.default.get(url)).data as string;

    let matches = parseMatches(data);    

    console.log(matches);
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

export const publishScores = functions
.runWith({
    memory: "4GB"
})
.pubsub.schedule('01 * * * *').onRun(async context => {
    await publishScoresOfPastMatches();
});


exports.api = functions.https.onRequest(api);
exports.openApi = functions.runWith({
    memory: "4GB"
})
.https.onRequest(openApi);
exports.crawl = functions.https.onRequest(crawl);