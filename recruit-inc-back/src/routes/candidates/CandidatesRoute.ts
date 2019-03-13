import { baseRoute } from '../baseRoute';
import { ObtainCandidatesCommand } from '../../domain/command/ObtainCandidatesCommand';
import { Response, Request } from 'express';

export class CandidatesRoute extends baseRoute {
  public routes(app): void {
    /**
     * GET to obain all candidate in database (assuming we only have Montreal people for now)
     */
    app
      .route('/api/candidates')
      .get(async (request: Request, response: Response) => {
        try {
          const candidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
          let candidates: any;
          let page: number = request.query.page;
          let filter: string = request.query.filter;
          if (filter == undefined && page == undefined) {
            // User wants all candidates
            candidates = await candidatesCommand.getAllCandidates();
          } else {
            //User wants candidates by page
            candidates = await candidatesCommand.getCandidates(page, filter);
          }

          this.logCommandCompleted(
            this.routes.name,
            ' GET candidates with filter... '
          );
          response.status(200).send(candidates);
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

    app
      .route('/api/candidates/technologies')
      .get(async (request: Request, response: Response) => {
        try {
          const candidatesTechnologies: ObtainCandidatesCommand = new ObtainCandidatesCommand();
          let candidates: any;
          let technologies: any;
          let page: number = request.query.page;
          let filter: string = request.query.filter;

          const Tech = await candidatesTechnologies.getCandidatesTechnologies(
            page,
            filter
          );

          this.logCommandCompleted(
            this.routes.name,
            ' GET candidates with filter... '
          );
          response.status(200).send(Tech);
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Candidates',
            CommandException.name,
            CommandException.message
          );
          response.send(404).send("Can't get Candidates technologies");
        }
      });
  }
}
