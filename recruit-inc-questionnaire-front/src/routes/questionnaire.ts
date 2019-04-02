import express, { Request, Response } from 'express';
import axios from 'axios';

export class QuestionnaireRoute {

    private static questions: Array<{ type: string, questions: Array<any> }>;
    private static answers: Array<any>;
    private static step: number;

    public static routes(app: express.Application): void {
        app
            .route('/questionnaire')
            .get(async (req: Request, res: Response) => {

                // extract name and step from query params
                const { name, step } = req.query;

                // simply redirect to start if these are missing, avoids unwanted users from accessing the questionnaire page
                // there is definitely and opportunity to increase security here but for our purposes this implementation will suffice
                if (!name) {
                    return res.redirect('/');
                }
                if (!step) {
                    return res.redirect('/');
                }


                // record the step globally for later use
                // this should also overwrite any previous value as starting a questionnaire from the start sends a 0 value
                QuestionnaireRoute.step = step;

                // attempt a request to get all the questions
                let questions;
                try {

                    // if questions don't exist globally, process the response
                    // else take the global values
                    // this is done so that only one request is sent over the lifetime of the questionnaire
                    // may provide opportunity to allow a candidate to refresh the page without the questions changing
                    if (!QuestionnaireRoute.questions) {
                        const request = await axios.get(`${process.env.API_URI}/api/questions`);

                        QuestionnaireRoute.questions = QuestionnaireRoute.processQuestions(request.data);
                        questions = QuestionnaireRoute.questions

                    } else {
                        questions = QuestionnaireRoute.questions;
                    }

                } catch (err) {
                    console.error(err);
                    // TODO - logger
                }

                // if everything succeeded and we have questions, render the questionnaire page with the first group of questions
                // else redirect to the start
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
            .post(async (req: Request, res: Response) => {

                // extract the body from the request
                // this is values of the questionnaire selected by the candidate
                const { body } = req;

                // simply redirect to start if these are missing, avoids unwanted users from posting to the questionnaire page
                // there is definitely and opportunity to increase security here but for our purposes this implementation will suffice
                if (!body) {
                    return res.redirect('/');
                }
                if (!body.step || !body.name) {
                    return res.redirect('/');
                } else {
                    // increment the global step value to prepare for the next step of the questionnaire
                    QuestionnaireRoute.step++;
                }

                // initialize a global empty array of answers if one does not already exist
                if (!QuestionnaireRoute.answers) {
                    QuestionnaireRoute.answers = [];
                }

                // push the answers to the global array
                QuestionnaireRoute.answers.push(body);

                // if we are in the last step of the questionnaire, we calculate the scores and attempt to post the to the db
                // else we continue with the questionnaire by redirecting to the next set of questions by providing the next step
                const isLastStep = QuestionnaireRoute.step == QuestionnaireRoute.questions.length;
                if (isLastStep) {

                    // calculate scores
                    const scores: { fullName: string, total: number, group: Array<{ type: string, total: number }> } =
                        QuestionnaireRoute.calculateScores(QuestionnaireRoute.questions, QuestionnaireRoute.answers);

                    // attempt to post the score to the db
                    try {
                        await axios.post(`${process.env.API_URI}/api/results`, scores);
                        return res.redirect('/finished');
                    } catch (err) {
                        console.error(err);
                        // TODO - logger
                    }
                } else {
                    res.redirect(`/questionnaire?name=${body.name}&step=${QuestionnaireRoute.step}`)
                }
            });
    }

    // breaks up the questions from the db into groups based on type and randomizes question order as well as their answers
    private static processQuestions(questions: Array<any>): Array<any> {

        const types = [...new Set(questions.map(q => q.type))];

        // break the questions up into groups
        let groupedQuestions: Array<{ type: string, questions: Array<any> }> = [];
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
        return QuestionnaireRoute.questions;

    }

    private static getNRandomQuestions(questions: Array<any>, n: number): Array<any> {
        return questions.sort(() => 0.5 - Math.random()).slice(0, n);
    }

    private static randomizeAnswers(answers: Array<any>): Array<any> {
        return answers.sort(() => 0.5 - Math.random());
    }

    // compares the candidates answers and the questions in the global scope to calculate the total score and the score breakdowns
    private static calculateScores(groupedQuestions: Array<any>, groupedAnswers: Array<any>): { fullName: string, total: number, group: Array<{ type: string, total: number }> } {

        const results: Array<{ type: string, total: number }> = [];
        let name: string = '';

        groupedAnswers.forEach((group) => {
            // extract name and step from each group
            name = group.name;
            const step = group.step;
            delete group.name;
            delete group.step;

            results.push({
                type: groupedQuestions[step].type,
                total: 0
            });

            // for each group of answers, extract the ids of the questions the answer matches
            const answerKeys = Object.keys(group);

            // iterate through answer keys to get the correct answer from the global values
            answerKeys.forEach(answerKey => {

                const matchingQuestion = groupedQuestions[step].questions.filter((q: any) => q._id === answerKey)[0];
                const matchingAnswer = matchingQuestion.answers.filter((a: any) => a.answer === group.answerKey)[0];
                /*
                    matchedAnswer =
                    {
                        answer: '',
                        isCorrect: true
                    }
                */

                // if the answer is correct, increment score
                if (matchingAnswer.isCorrect) {
                    results[step].total++
                }

            });
        });

        // reduce the array by summing the scores of each type
        const total = results.reduce((aggregate, item) => aggregate + item.total, 0);

        return { fullName: name, total, group: results };
    }
}