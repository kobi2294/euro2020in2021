import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Match } from "./match.model";
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});

export const readMatches = functions.https.onRequest(async (request, response) => {
    const snapshot = await admin.firestore()
        .collection('matches')
        .orderBy('id')
        .get();

    const docs = snapshot.docs.map(doc => doc.data());

    response.send(docs);
});

export const resetMatches = functions.https.onRequest((request, response) =>
    corsHandler(request, response, async () => {


        const matches = admin.firestore().collection('matches');

        const data = JSON.parse(request.body) as Match[];

        var existing = await matches.get();
        var deletePromises = existing.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);


        var setPromises = data.map(obj => matches.doc(obj.id.toString().padStart(2, '0')).set(obj));
        await Promise.all(setPromises);
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.status(200).send();
    }));
