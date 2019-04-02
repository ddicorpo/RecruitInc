import express, { Request, Response } from 'express';

export class QuestionnaireRoute {

    public static routes(app: express.Application): void {
        app
            .route('/questionnaire')
            .get((req: Request, res: Response) => {
                res.render('questionnaire')
            });
    }
}