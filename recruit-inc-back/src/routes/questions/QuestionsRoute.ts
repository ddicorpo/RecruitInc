import { baseRoute } from '../baseRoute';
import { ObtainCandidatesCommand } from '../../domain/command/ObtainCandidatesCommand';
import { Response, Request } from 'express';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { ObrtainQuestionaireQuestionsCommand } from '../../domain/command/ObtainQuestionnaireQuestionsCommand';

export class QuestionsRoute extends baseRoute {
  public routes(app): void {
    /**
     * GET to obain all candidate in database (assuming we only have Montreal people for now)
     */
    app
      .route('/api/questions')
      .get(async (request: Request, response: Response) => {
        try {
          const questionsCommand: ObrtainQuestionaireQuestionsCommand = new ObrtainQuestionaireQuestionsCommand();
          let questions: any[];
          let page: number = request.query.page;
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

          this.logCommandCompleted(
            this.routes.name,
            ' GET candidates with filter... '
          );
          response.status(200).send(questions);
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Candidates',
            CommandException.name,
            CommandException.message
          );
          response.send(404).send("Can't get Candidates");
        }
      });
  }
}
