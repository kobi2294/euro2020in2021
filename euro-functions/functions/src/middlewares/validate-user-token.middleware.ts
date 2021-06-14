import * as express from 'express';
import * as admin from "firebase-admin";

export const validateUserToken = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('validating');
    let auth = req.headers.authorization ?? '';

    if (!auth.startsWith('Bearer ')) {
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken = auth.split('Bearer ')[1];
    console.log('found token ', idToken);

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log('verified token ', decodedToken);
        res.locals.user = decodedToken;
        res.locals.authenticated = true;
        next();
    }
    catch (error) {
        res.status(403).send('Unauthorized');
    }


}
