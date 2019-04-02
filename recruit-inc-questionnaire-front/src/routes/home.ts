import express, { Request, Response } from 'express';

export class HomeRoute {

    public static routes(app: express.Application): void {

        app
            .route('/')
            .get((req: Request, res: Response) => {

                res.render('home');

            });

    }
}