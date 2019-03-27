import { baseRoute } from '../baseRoute';
import { Response, Request } from 'express';
import { ObrtainQuestionaireQuestionsCommand } from '../../domain/command/ObtainQuestionnaireQuestionsCommand';
import { questionsTDG } from '../../data-source/table-data-gateway/questionsTDG';

export class QuestionsRoute extends baseRoute {
  public routes(app): void {
    /**
     * GET to obtain all candidate in database (assuming we only have Montreal people for now)
     */
    app
      .route('/api/questions')
      .get(async (request: Request, response: Response) => {
        try {
          const questionsCommand: ObrtainQuestionaireQuestionsCommand = new ObrtainQuestionaireQuestionsCommand();
          let questions: any[];
          let page: number = request.query.page || 1;

          if (request.query.filter === undefined && page === undefined) {
            // User wants all candidates
            questions = await questionsCommand.getQuestionnaireResults(
              page,
              []
            );
          } else {
            //User wants candidates by page
            const rawFilters = request.query.filter;

            // Make sure the filters always are in an array
            let filter: string[] = [];

            if (rawFilters !== undefined) {
              filter = Array.isArray(rawFilters) ? rawFilters : [rawFilters];
            }

            questions = await questionsCommand.getQuestionnaireResults(
              page,
              filter
            );
          }

          // const questionsFinder: QuestionsFinder = new QuestionsFinder();
          //
          // try {
          //     const questions = await questionsModel.findAll();

          this.logCommandCompleted(
            this.routes.name,
            ' GET questions with filter... '
          );
          return response.status(200).send(questions);
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Questions',
            CommandException.name,
            CommandException.message
          );
          return response.status(400).send("Can't get Questions");
        }
      });

    app
      .route('/api/questions')
      .post(async (request: Request, response: Response) => {
        const { question, answers, type } = request.body;

        const questionTDG: questionsTDG = new questionsTDG();

        try {
          await questionTDG.create({ question, answers, type });

          return response.status(201).send('Question Created Successfully');
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'POST Question',
            CommandException.name,
            CommandException.message
          );
          return response.status(400).send("Can't get Questions");
        }
      });

    app
      .route('/api/questions/:id')
      .patch(async (request: Request, response: Response) => {
        const { id: questionId } = request.params;

        const { question, answers, type } = request.body;

        const questionTDG: questionsTDG = new questionsTDG();

        try {
          await questionTDG.update(questionId, { question, answers, type });

          return response.status(200).send('Question updated successfully');
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'DELETE Question',
            CommandException.name,
            CommandException.message
          );
          return response
            .status(400)
            .send("Can't update Question with id " + questionId);
        }
      });

    app
      .route('/api/questions/:id')
      .delete(async (request: Request, response: Response) => {
        const { id: questionId } = request.params;

        try {
          const questionTDG: questionsTDG = new questionsTDG();

          await questionTDG.delete(questionId);

          return response.status(203).send('Question Deleted Successfully');
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'DELETE Question',
            CommandException.name,
            CommandException.message
          );
          return response
            .status(400)
            .send("Can't delete Question with id " + questionId);
        }
      });
  }
}
