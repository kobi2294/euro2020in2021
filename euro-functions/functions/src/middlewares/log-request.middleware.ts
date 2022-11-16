import * as express from 'express';

export const logRequest = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('api request');
    console.log('url: ', req.url);
    console.log('method: ', req.method);
    console.log('body ', req.body);
    next();
};
