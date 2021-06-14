import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Match } from "./match.model";
import * as cors from 'cors';
import * as express from 'express';
import { User } from "./user.model";
import { validateUserToken } from "./middlewares/validate-user-token.middleware";
import { Stage } from "./stage.model";
import { Guess } from "./guess.model";

const corsHandler = cors({ origin: true });
const api = express();
api.use(corsHandler);
api.use(validateUserToken);
admin.initializeApp();

api.get('/hello', (req, res) => {
    console.log('hi there');
    const user = res.locals.user;
    console.log('user = ', user);
    
    res.send('"Hello From firebase 2!!!"');
});

api.get('/matches', async (req, res) => {
    const snapshot = await admin.firestore()
        .collection('matches')
        .orderBy('id')
        .get();

    const docs = snapshot.docs.map(doc => doc.data() as Match);

    res.send(docs);
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
    const snapshot = await admin.firestore()
        .collection('stages')
        .orderBy('id')
        .get();

    const docs = snapshot.docs.map(doc => doc.data() as Stage);

    res.send(docs);
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

exports.api = functions.https.onRequest(api);
