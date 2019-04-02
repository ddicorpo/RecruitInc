import express, { Request, Response } from 'express';
import axios from 'axios';

export class QuestionnaireRoute {

    private static questions: Array<any>;
    private static answers: Array<any>;
    private static step: number;

    public static routes(app: express.Application): void {
        app
            .route('/questionnaire')
            .get(async (req: Request, res: Response) => {

                const { name, step } = req.query;

                if (!name) {
                    return res.redirect('/');
                }

                if (!step) {
                    return res.redirect('/');
                }

                QuestionnaireRoute.step = step;

                let questions;
                try {
                    const request = await axios.get(`${process.env.API_URI}/api/questions`);

                    if (!QuestionnaireRoute.questions) {

                        questions = QuestionnaireRoute.processQuestions(request.data);

                    } else {
                        questions = QuestionnaireRoute.questions;
                    }

                } catch (err) {
                    console.error(err);
                }

                if (questions) {
                    res.render('questionnaire', {
                        questionGroup: questions[QuestionnaireRoute.step],
                        isLastStep: QuestionnaireRoute.step == QuestionnaireRoute.questions.length - 1,
                        name,
                        step
                    });
                } else {
                    res.redirect('/');
                }

            });

        app
            .route('/questionnaire')
            .post((req: Request, res: Response) => {

                const { body } = req;

                if (!body.step || !body.name) {
                    return res.redirect('/');
                } else {
                    QuestionnaireRoute.step++;
                }

                if (!body) {
                    return res.redirect('/');
                }

                if (!QuestionnaireRoute.answers) {
                    QuestionnaireRoute.answers = [];
                }

                QuestionnaireRoute.answers.push(body);

                const isLastStep = QuestionnaireRoute.step == QuestionnaireRoute.questions.length;
                if (isLastStep) {

                    console.log(QuestionnaireRoute.answers);
                    return res.redirect('/finished');

                } else {
                    res.redirect(`/questionnaire?name=${body.name}&step=${QuestionnaireRoute.step}`)
                }


            });
    }

    private static processQuestions(questions: Array<any>): Array<any> {

        const types = [...new Set(questions.map(q => q.type))];

        // break the questions up into groups
        let groupedQuestions: Array<any> = [];
        types.forEach(type => {
            groupedQuestions.push({
                type,
                questions: questions.filter(q => q.type === type)
            });
        });

        // get a random n amount of questions
        // randomize the answers of those n amount of questions
        groupedQuestions = groupedQuestions.map((gq: any) => {
            gq.questions = QuestionnaireRoute.getNRandomQuestions(gq.questions, 5);
            gq.questions.forEach((q: any) => {
                q.answers = QuestionnaireRoute.randomizeAnswers(q.answers);
                return q;
            })
            return gq;
        });

        QuestionnaireRoute.questions = groupedQuestions;
        // console.log('setting questions', groupedQuestions);
        return QuestionnaireRoute.questions;

    }

    private static getNRandomQuestions(questions: Array<any>, n: number): Array<any> {
        return questions.sort(() => 0.5 - Math.random()).slice(0, n);
    }

    private static randomizeAnswers(answers: Array<any>): Array<any> {
        return answers.sort(() => 0.5 - Math.random());
    }
}