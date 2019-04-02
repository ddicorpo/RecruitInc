import express, { Request, Response } from 'express';
import { HttpStatus } from '../http/http-status.enum';

export class HomeRoute {

    public static routes(app: express.Application): void {

        app
            .route('/')
            .get((req: Request, res: Response) => {

                res.render('home');

            });

        app
            .route('/')
            .post(async (req: Request, res: Response) => {

                const { name } = req.body;

                if (!name) {
                    return res.status(HttpStatus.BAD_REQUEST).send('invalid name');
                }

                res.redirect(`/questionnaire?name=${name}`);
            })

    }
}