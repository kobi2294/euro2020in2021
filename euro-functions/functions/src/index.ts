import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

export const readMatches = functions.https.onRequest(async (request, response) => {
    let snapshot = await admin.firestore().collection('matches').get();

    let txt: string[] = [];

    snapshot.docs.forEach(doc => {
        let date = doc.get('date') as string;
        let reg = /June\/(\d+)\s*(\d+):(\d+)/;
        let res = date.match(reg);

        if (res !== null) {
            let newDate = new Date(2021, 5, Number(res[1]), Number(res[2]), Number(res[3]), 0, 0);

            txt.push(`${doc.get('id')} ${JSON.stringify(newDate)}`);
        }
    });
    
    response.send({
        'now': JSON.stringify(new Date()), 
        'dates': txt
    });
});
