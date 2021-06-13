import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Match } from "./match.model";
import * as cors from 'cors';
import * as express from 'express';
import { User } from "./user.model";

const corsHandler = cors({ origin: true });
const api = express();
api.use(corsHandler);
admin.initializeApp();

api.get('/hello', (req, res) => {
    console.log('hi there');
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

api.post('/users', async (req, res) => {
    const users = admin.firestore().collection('users');
    const data = JSON.parse(req.body) as User;

    await users.doc(data.email).set({
        ...data
    });

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
