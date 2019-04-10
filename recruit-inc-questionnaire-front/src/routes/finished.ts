import express, { Request, Response } from 'express';

export class FinishedRoute {

    public static routes(app: express.Application): void {
        app
            .route('/finished')
            .get((req: Request, res: Response) => {
                res.render('finished')
            });
    }
}