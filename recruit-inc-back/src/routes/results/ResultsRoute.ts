import { baseRoute } from '../baseRoute';
import { Response, Request } from 'express';
import { ObtainQuestionnaireResultsCommand } from '../../domain/command/ObtainQuestionnaireResultsCommand';
import { resultsTDG } from '../../data-source/table-data-gateway/resultsTDG';

export class ResultsRoute extends baseRoute {
  public routes(app): void {
    /**
     * Get to obtain all results in database
     */
    app
      .route('/api/results')
      .get(async (request: Request, response: Response) => {
        try {
          const resultsCommand: ObtainQuestionnaireResultsCommand = new ObtainQuestionnaireResultsCommand();
          let results: any[];
          let page: number = request.query.page || 1;

          if (request.query.filter === undefined && page === undefined) {
            // User wants all results
            results = await resultsCommand.getQuestionnaireResults(page, []);
          } else {
            // User wants results by page
            const rawFilters = request.query.filter;

            //Make sure the filters always are in an array
            let filter: string[] = [];

            if (rawFilters !== undefined) {
              filter = Array.isArray(rawFilters) ? rawFilters : [rawFilters];
            }

            results = await resultsCommand.getQuestionnaireResults(
              page,
              filter
            );
          }

          this.logCommandCompleted(
            this.routes.name,
            'Get results with filter...'
          );
          return response.status(200).send(results);
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Results',
            CommandException.name,
            CommandException.message
          );
          return response.status(400).send("Can't get Results");
        }
      });

    /**
     * Add a result to the database
     */
    app
      .route('/api/results')
      .post(async (request: Request, response: Response) => {
        const { fullName, total, group } = request.body;

        const resultTDG: resultsTDG = new resultsTDG();

        try {
          await resultTDG.create({ fullName, total, group });

          return response.status(201).send('Result Created Successfully');
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'POST Result',
            CommandException.name,
            CommandException.message
          );
          return response.status(400).send("Can't add Result");
        }
      });
  }
}
